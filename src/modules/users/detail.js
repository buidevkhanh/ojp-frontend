import { useEffect, useRef, useState } from "react";
import { callGetDetail } from "../../api/problem.api";
import { getCookie, setCookie } from "../../helpers/cookie.helper";
import CodeEditor from "../commons/editor";
import Footer from "../commons/footer";
import NavigationBar from "../commons/navigation";
import { Toaster } from "../commons/toast";
import UserRunner from "./runner";
import socket from "../../helpers/sockets/index";
import { AppObject } from "../../configs/app.object";
import { useSearchParams } from "react-router-dom";
import { callDetailSubmit } from "../../api/submission.api";
import { editComment, getComments, getOwnReaction, reaction, updateReply, userComment, userReply } from "../../api/comment";
import prettyMilliseconds from 'pretty-ms';
import { Loading } from "../commons/loading";

export default function ProblemDetail() {
  const [problem, setProblem] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [code, setCode] = useState();
  const [language, setLanguage] = useState('java');
  const [toast, setToast] = useState(<></>);
  const [token, setToken] = useState();
  const [showRun, setShowRun] = useState(false);
  const [params, setParams] = useSearchParams();
  const [comment, setComment] = useState([]);
  const [map, setMap] = useState(new Map());
  const [replyMap, setReplyMap] = useState(new Map());
  const [ownReaction, setOwnReaction] = useState([]);
  const [loading, setLoading] = useState([]);
  const [loadComment, setLoadComment] = useState([]);

  const userCmt = useRef();

  useEffect(() => {
    const isEdit = params.get('edit');
    if(isEdit) {
      setLoading(<Loading/>);
      setLoadComment(
      <div class="w-100 text-center mt-2">
        <div class="spinner-border text-dark" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>);
      callDetailSubmit(isEdit).then((data) => {
        setCode(data.data.userCode);  
        setLanguage(data.data.language || 'cpp');
        const path = window.location.pathname;
        const code = path.split("/").at(-1);
        setToken(getCookie('_token'));
        callGetDetail(code)
          .then((data) => {
            setProblem(data.data);
            setLoading();
            getOwnReaction(data.data._id.toString()).then((data) => {
              setOwnReaction(data.data.data);
            })
            getComments(data.data._id.toString()).then((data) => {
              setComment(data.data.data);
              const newMap = structuredClone(map);
              for(let i = 0; i < data.data.data.length; i++) {
                 newMap.set(data.data.data[i]._id.toString(), data.data.data[i].content);
                 for(let j = 0; j < data.data.data[i].replies.length; j++) {
                  const subcmt = data.data.data[i].replies[j];
                  newMap.set(subcmt._id.toString(), subcmt.content);
                 }
              }
              setMap(newMap);
              setReplyMap(newMap);
              setLoadComment();
            }).catch((error) => {
            })
          })
          .catch((error) => {
            setToast(<Toaster message={"problemNotFound"} type="error" />);
          });
      })
    } else {
      setLoading(<Loading/>);
      setLoadComment(
      <div class="w-100 text-center mt-2">
        <div class="spinner-border text-dark" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>)
      const path = window.location.pathname;
      const code = path.split("/").at(-1);
      setToken(getCookie('_token'));
      callGetDetail(code)
        .then((data) => {
          setProblem(data.data);
          setLoading();
          getOwnReaction(data.data._id.toString()).then((data) => {
            setOwnReaction(data.data.data);
          })
          getComments(data.data._id.toString()).then((data) => {
            setComment(data.data.data);
            const newMap = structuredClone(map);
            for(let i = 0; i < data.data.data.length; i++) {
               newMap.set(data.data.data[i]._id.toString(), data.data.data[i].content);
               for(let j = 0; j < data.data.data[i].replies.length; j++) {
                const subcmt = data.data.data[i].replies[j];
                newMap.set(subcmt._id.toString(), subcmt.content);
               }
            }
            setMap(newMap);
            setReplyMap(newMap);
            setLoadComment();
          }).catch((error) => {
          })
        })
        .catch((error) => {
          setToast(<Toaster message={"problemNotFound"} type="error" />);
        });
    }
  }, []);

  function submitCode() {
    if(code.trim() === "") {
      setToast(<Toaster message={"Mã nguồn không thể để rỗng"} type="warning"/>);
      return;
    }
    socket.emit(AppObject.SOCKET_ACTIONS.ACTION_SUBMIT_PROBLEM, {
      code: code,
      language: language,
      token: token,
      problem: problem
    });
   window.location.assign("/history?auth=me");
  }

  function setUser(user) {
    setCurrentUser(user);
  }

  function handleTextChange(e) {
    const line = e.target.value.split('\n').length;
    let id = e.target.id.split('editText')?.[1];
    if(!id) {
      id = e.target.id.split('replyText')?.[1];
      const newMap = structuredClone(map);
      newMap.set(id,e.target.value);
      setReplyMap(newMap);
    } else {
      const newMap = structuredClone(map);
      newMap.set(id,e.target.value);
      setMap(newMap);
    }
    e.target.setAttribute("style", "height: " + (line * 15 + (line-1)*2 + 22) + "px; overflow-y: hidden");
  }

  function handleTime(dateStr) {
    const time = prettyMilliseconds(new Date() - new Date(dateStr));
    let returnTime = time.split(" ")[0];
    returnTime = returnTime.split('d').join(' ngày');
    returnTime = returnTime.split('m').join(' phút');
    if(returnTime.includes('ms')) {
      return 'Vừa mới';
    }
    if(returnTime.includes('s')) {
      return 'Vừa mới';
    }
    return returnTime + " trước";
  }

  function handleUpdateReply(replyId) {
    const content = map.get(replyId);
    updateReply(replyId, content).then(() => {
       getComments(problem._id.toString()).then((data) => {
         setComment(data.data.data);
         const newMap = structuredClone(map);
           for(let i = 0; i < data.data.data.length; i++) {
              newMap.set(data.data.data[i]._id.toString(), data.data.data[i].content);
              for(let j = 0; j < data.data.data[i].replies.length; j++) {
               const subcmt = data.data.data[i].replies[j];
               newMap.set(subcmt._id.toString(), subcmt.content);
              }
           }
           setMap(newMap);
       }).catch((error) => {
       })
    }).catch(() => {
     setToast(<Toaster message="Edit error" type={"error"}/>)
   });
 }

  function handleUpdateCmt(commentId) {
     const content = map.get(commentId);
     setLoadComment(
      <div class="w-100 text-center mt-2">
        <div class="spinner-border text-dark" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>);
     editComment(commentId, content).then(() => {
        getComments(problem._id.toString()).then((data) => {
          setComment(data.data.data);
          setLoadComment();
          const newMap = structuredClone(map);
            for(let i = 0; i < data.data.data.length; i++) {
               newMap.set(data.data.data[i]._id.toString(), '');
               for(let j = 0; j < data.data.data[i].replies.length; j++) {
                const subcmt = data.data.data[i].replies[j];
                newMap.set(subcmt._id.toString(), subcmt.content);
               }
            }
            setMap(newMap);
        }).catch((error) => {
        })
     }).catch(() => {
      setToast(<Toaster message="Edit error" type={"error"}/>)
    });
  }

  function handleReply(commentId) {
    const content = replyMap.get(commentId);
    setLoadComment(
      <div class="w-100 text-center mt-2">
        <div class="spinner-border text-dark" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>);
    document.querySelector(`#replyText${commentId}`).value = '';
    userReply(content, commentId).then(() => {
      getComments(problem._id.toString()).then((data) => {
      setComment(data.data.data);
      setLoadComment();
      const newMap = structuredClone(map);
        for(let i = 0; i < data.data.data.length; i++) {
           newMap.set(data.data.data[i]._id.toString(), '');
           for(let j = 0; j < data.data.data[i].replies.length; j++) {
            const subcmt = data.data.data[i].replies[j];
            newMap.set(subcmt._id.toString(), subcmt.content);
           }
        }
        setMap(newMap);
      }
    ).catch((error) => {
    })
    })
  }

  function hanleReaction(targetId) {
    setLoadComment(
      <div class="w-100 text-center mt-2">
        <div class="spinner-border text-dark" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>);
    reaction(targetId).then(() => {
      getOwnReaction(problem._id).then((data) => {
        setOwnReaction(data.data.data);
        getComments(problem._id.toString()).then((data) => {
          setComment(data.data.data);
          setLoadComment();
          const newMap = structuredClone(map);
              for(let i = 0; i < data.data.data.length; i++) {
                 newMap.set(data.data.data[i]._id.toString(), data.data.data[i].content);
                 for(let j = 0; j < data.data.data[i].replies.length; j++) {
                  const subcmt = data.data.data[i].replies[j];
                  newMap.set(subcmt._id.toString(), subcmt.content);
                 }
              }
              setMap(newMap);
        }).catch((error) => {
        })
      })
    })
  }

  const listComment = comment ? comment.map((item, index) => {
    const reaction = ownReaction?.filter((i) => {
      return i.target.toString() === item._id.toString();
    })?.[0] || null;
    return (
      <>
        <div key={index} className="comment px-1 d-flex position-relative flex-column justify-content-between align-items-start my-3">
            <div className="d-flex justify-content-start align-items-center">
              <img width={'20px'} height={'20px'} style={{border: '1px solid #e3e3e3', borderRadius: '50%'}} src={item.user.avatar}></img>
              <p className="mx-2 my-0 p-0" style={{fontWeight: 'bold', fontSize: '14px'}}>{item.user.displayName}</p>
            </div>
            <div style={{width: '90%', borderRadius: '3px', padding: '10px 0px', fontSize: '14px'}}>
                <p className="m-0 p-0">{item.content}</p>
            </div>
            <div className="comment-info d-flex justify-content-start align-items-center">
              {reaction && reaction.type === 'agreement' ? <i onClick={() => hanleReaction(item._id.toString())} className="text-success fas fa-heart"></i> : <i onClick={() => hanleReaction(item._id.toString())} className="far fa-heart"></i>}
              {reaction && reaction.type === 'agreement' ? <p className="p-0 m-0 mx-1 text-success d-inline">{item.agreement}</p> : <p className="p-0 m-0 mx-1 d-inline">{item.agreement}</p>}
              { currentUser && currentUser.displayName === item.user.displayName ?
              <div className="owner d-flex justify-content-between">
                <div className="cursor mx-1" style={{borderRadius: '5px'}} onClick={() => document.querySelector(`#edit${item._id.toString()}`).classList.remove('d-none')}>
                <i className="fas fa-pen mx-1 text-secondary" style={{fontSize: '12px'}}></i>
                  <p className="p-0 m-0 mx-1 d-inline">Chỉnh sửa</p>
                </div>
              </div>
              : null }
              <div className="text-secondary mx-2 d-flex justify-content-start align-items-center" style={{fontSize: '12px'}}><div className="bg-secondary mr-1" style={{width: '4px', height: '4px', borderRadius: '50%'}}></div>{handleTime(item.updatedAt)}</div>
            </div> 
        </div>
        { currentUser ?
        <div className="reply-comment d-flex justify-content-between align-items-center" id={`reply${item._id.toString()}`}>
            <img width={'20px'} height={'20px'} style={{border: '1px solid #e3e3e3', borderRadius: '50%'}} src={currentUser.avatar}></img>
            <textarea className="custome-area-2 w-100 ml-2" defaultValue={''} id={`replyText${item._id.toString()}`} onChange={(e) => handleTextChange(e)} placeholder={`Trả lời bình luận của ${item.user.displayName}`}>

            </textarea>
            <div className="send text-secondary cursor" onClick={() => {handleReply(item._id.toString())}}>
              <i className="far fa-paper-plane mx-2"></i>
            </div>
        </div> : null}
        {
          currentUser && currentUser.displayName === item.user.displayName ? 
          <div className="edit-comment d-none d-flex justify-content-between align-items-center" id={`edit${item._id.toString()}`}>
              <img width={'20px'} height={'20px'} style={{border: '1px solid #e3e3e3', borderRadius: '50%'}} src={currentUser.avatar}></img>
              <textarea className="custome-area-2 w-100 ml-2" defaultValue={item.content} id={`editText${item._id.toString()}`} onChange={(e) => handleTextChange(e)} placeholder={`Update your comment`}>

              </textarea>
              <div className="send d-flex text-secondary cursor">
                <i className="d-flex justify-content-center align-items-center bg-success text-white fas fa-check ml-2" onClick={() => {handleUpdateCmt(item._id.toString()); document.querySelector(`#edit${item._id.toString()}`).classList.add('d-none')}} style={{width: '39px', height: '39px', borderRadius: '5px'}}></i>
                <i className="d-flex justify-content-center align-items-center bg-danger text-white fas fa-times ml-2" style={{width: '39px', height: '39px', borderRadius: '5px'}} onClick={() => {document.querySelector(`#edit${item._id.toString()}`).classList.add('d-none')}}></i>
              </div>
          </div> : null
        }
        {
          item.replies.map((i,id) => {
            const subreaction = ownReaction?.filter((it) => {
              return it.target.toString() === i._id.toString();
            })?.[0] || null;
            return (
              <div className="subcomment px-1 w-100 d-flex align-items-end flex-column my-3">
                  <div style={{width: '96%', padding: '1%', borderLeft: '1px solid #a3a3a3'}}>
                    <div className="d-flex justify-content-start align-items-center">
                      <img width={'20px'} height={'20px'} style={{border: '1px solid #e3e3e3', borderRadius: '50%'}} src={i.user.avatar}></img>
                      <p className="mx-2 my-0 p-0" style={{fontWeight: 'bold', fontSize: '14px'}}>{i.user.displayName}</p>
                    </div>
                    <div style={{width: '90%', borderRadius: '3px', padding: '10px 0px', fontSize: '14px'}}>
                        <p className="m-0 p-0">{i.content}</p>
                    </div>
                    <div className="comment-info d-flex justify-content-start align-items-center">
                    {subreaction && subreaction.type === 'agreement' ? <i onClick={() => hanleReaction(i._id.toString())} className="text-success fas fa-heart"></i> : <i onClick={() => hanleReaction(i._id.toString())} className="far fa-heart"></i>}
                    {subreaction && subreaction.type === 'agreement' ? <p className="p-0 m-0 mx-1 text-success d-inline">{i.agreement}</p> : <p className="p-0 m-0 mx-1 d-inline">{i.agreement}</p>}
                      { currentUser && currentUser.displayName === i.user.displayName ?
                        <div className="owner d-flex justify-content-between">
                          <div className="cursor mx-1" style={{borderRadius: '5px'}} onClick={() => document.querySelector(`#rep_edit${i._id.toString()}`).classList.remove('d-none')}>
                          <i className="fas fa-pen mx-1 text-secondary" style={{fontSize: '12px'}}></i>
                            <p className="p-0 m-0 mx-1 d-inline">Chỉnh sửa</p>
                          </div>
                        </div>
                        : null }
                      <div className="text-secondary mx-2 d-flex justify-content-start align-items-center" style={{fontSize: '12px'}}><div className="bg-secondary mr-1" style={{width: '4px', height: '4px', borderRadius: '50%'}}></div>{handleTime(i.updatedAt)}</div>
                    </div> 
                    {
                      currentUser && currentUser.displayName === i.user.displayName ? 
                      <div className="reply-comment d-none d-flex justify-content-between align-items-center" id={`rep_edit${i._id.toString()}`}>
                          <img width={'20px'} height={'20px'} style={{border: '1px solid #e3e3e3', borderRadius: '50%'}} src={currentUser.avatar}></img>
                          <textarea className="custome-area-2 w-100 ml-2" defaultValue={i.content} id={`editText${i._id.toString()}`} onChange={(e) => handleTextChange(e)}>

                          </textarea>
                          <div className="send d-flex text-secondary cursor">
                            <i className="d-flex justify-content-center align-items-center bg-success text-white fas fa-check ml-2" onClick={() => {handleUpdateReply(i._id.toString()); document.querySelector(`#rep_edit${i._id.toString()}`).classList.add('d-none')}} style={{width: '39px', height: '39px', borderRadius: '5px'}}></i>
                            <i className="d-flex justify-content-center align-items-center bg-danger text-white fas fa-times ml-2" style={{width: '39px', height: '39px', borderRadius: '5px'}} onClick={() => {document.querySelector(`#rep_edit${i._id.toString()}`).classList.add('d-none')}}></i>
                          </div>
                      </div> : null
                    }
                  </div>
              </div>
            )
          })
        }
      </>
    )
  }): null;

  function handleComment(){
    if(!userCmt.current.value.trim()) {
      setToast(<Toaster message="Comment can't be blank" type={"error"}/>);
      return;
    }
    setLoadComment(
      <div class="w-100 text-center mt-2">
        <div class="spinner-border text-dark" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>);
    userComment(userCmt.current.value, problem._id.toString()).then(() => {
      getComments(problem._id.toString()).then((data) => {
        setComment(data.data.data);
        setLoadComment();
        const newMap = structuredClone(map);
            for(let i = 0; i < data.data.data.length; i++) {
               newMap.set(data.data.data[i]._id.toString(), data.data.data[i].content);
               for(let j = 0; j < data.data.data[i].replies.length; j++) {
                const subcmt = data.data.data[i].replies[j];
                newMap.set(subcmt._id.toString(), subcmt.content);
               }
            }
            setMap(newMap);
      }).catch((error) => {
      })
    }).catch(() => {
      setToast(<Toaster message="Comment error" type={"error"}/>)
    });
  }

  return (
    <>
      {loading}
      {toast}
      <NavigationBar setUser = {setUser}/>
      { showRun ? <UserRunner problem={problem._id} token={token} hideRun={() => setShowRun(false)} code={code} language={language}/> : null}
      <div className="container py-3">
        {!problem ? (
          <div className="text-center py-3">
            <h1 className="text-primary large-text" style={{ fontWeight: "bold" }}>
              404
            </h1>
            <p className="text-secondary">
              Sorry ! unable find your requested resource, error code: 404
            </p>
          </div>
        ) : (
          <div className="py-3">
            <h4>
              {problem.problemName} - {problem.problemCode}
            </h4>
            {problem.problemLevel === "easy" ? (
              <p className="badge badge-opacity-success">Dễ</p>
            ) : (
              <p className="badge badge-opacity-warning">Trung bình</p>
            )}
            <div className="row">
              <div className="col-md-6 border">
                <div
                  className="py-3 px-2"
                  dangerouslySetInnerHTML={{ __html: problem.problemQuestion }}
                ></div>
              </div>
              <div className="col-md-6 border">
                <div className="py-3 px-2">
                  <h5>Đầu vào</h5>
                  <p>
                    {problem.expectedInput
                      ? problem.expectedInput
                      : "Không yêu cầu dữ liệu vào"}
                  </p>
                  <h5>Đầu ra</h5>
                  <p>
                    {problem.expectedOutput
                      ? problem.expectedOutput
                      : "Không yêu cầu dữ liệu ra"}
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 py-3 border">
                <h5>Ví dụ</h5>
                <h6>Đầu vào </h6>
                <pre class="m-0 p-0 pb-2">{problem.example.input || ''}</pre>
                <h6>Đầu ra </h6>
                <pre class="m-0 p-0">{problem.example.output}</pre>
              </div>
            </div>
            <div className="row">
              <div className="editor-code">
                <h4 className="my-4 p-0 mx-0">Trình soạn thảo mã nguồn trực tuyến</h4>
                <p className="m-0 text-danger">{ currentUser ? null : "Please login to unlock submit"}</p>
                <div className="action text-end">
                  <div className="btn btn-success" onClick={() => setShowRun(true)}>
                    {" "}
                    <i className="fa fa-cogs mx-2" aria-hidden="true"></i>Chạy test
                  </div>
                  { currentUser ?
                  <div className="btn btn-primary ml-2" onClick={() => submitCode()}>
                    {" "}
                    <i className="fa fa-upload mx-2" aria-hidden="true"></i>Chấm điểm
                  </div>
                  : null }
                </div>
                <CodeEditor default={code} defaultLanguage={language} changeCode={setCode} changeLanguage={setLanguage} />
              </div>
              <div className="comments p-0">
                <h4 className="my-4 p-0 mx-0">
                  <i className="far fa-comment mx-2"></i>
                  Bình luận
                </h4>
                { currentUser?
                <>
                <div className="text-area w-100 d-flex justify-content-between align-items-start">
                  <div style={{width: '5%'}} className="text-center comment__avatar">
                    <img width={'37px'} height={'37px'} style={{border: '1px solid #e3e3e3', borderRadius: '50%'}} src={currentUser.avatar}></img>
                  </div>  
                  <textarea className="custome-area-2 w-100 ml-2 comment__input" ref={userCmt} onChange={(e) => handleTextChange(e)} placeholder={'Nhập bình luận của bạn...'}>
                  </textarea>
                </div>
                <div className="text-end mt-2 p-0 " onClick={() => handleComment()}>
                    <div className="btn btn-success py-2">
                      <i className="far fa-paper-plane mx-2"></i>
                      Gửi bình luận
                    </div>
                </div>
                </>
              : <p className="text-danger m-0 p-0 my-2">Bạn cần đăng nhập để bình luận</p> }
              <hr></hr>
              {loadComment ? loadComment : listComment}
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
  </>
  );
}
