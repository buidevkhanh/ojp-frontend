import { useEffect, useState } from "react";
import { userGetContestHistory, userGetDetailContest, userGetScore } from "../../api/contest.api";
import Footer from "../commons/footer";
import NavigationBar from "../commons/navigation";
import socket from '../../helpers/sockets/index';
import { getCookie } from '../../helpers/cookie.helper';
import { AppObject } from "../../configs/app.object";
import { Toaster } from '../commons/toast';
import { confirmAlert } from "react-confirm-alert"; 
import "react-confirm-alert/src/react-confirm-alert.css";
import { Loading } from "../commons/loading";

export default function ContestOrganize() {
    const [detail, setDetail] = useState();
    const [show, setShow] = useState([]);
    const [isDone, setDone] = useState(false);
    const [point, setPoint] = useState([]);
    const [time, setTime] = useState('');
    const [score, setScore] = useState(0);
    const [files, setFiles] = useState([]);
    const [toast, setToast] = useState(<></>);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState();

    const token = getCookie("_token");

    useEffect(() => {
        const path = window.location.pathname;
        const contestId = path.split('/').at(-1);
        setLoading(<Loading/>);
        if(!contestId.match(new RegExp('^[a-f0-9]{24,24}$'))) {
           window.location.replace('/home');
        }
        userGetDetailContest(contestId).then((data) => {
            setDetail(data.data);
            const newFiles = [];
            for(let i = 0; i < data.data.questions.length; i++) {
                newFiles.push(null);
            }
            setFiles(newFiles);
            const initShow = [];
            for(let i = 0; i < data.data.questions.length; i++) {
                initShow.push(false);
                history.push({ problem: data.data.questions[i].problem._id, history: []});
                show.push(false);
                point.push(0);
            }
            setPoint([...point]);
            setHistory([...history]);
            setShow(initShow);
            socket.emit(AppObject.SOCKET_ACTIONS.JOIN_CONTEST, { contestId, token });
            userGetContestHistory(contestId).then((data) => {
                //const histories = data.data.history;
                if(data.data.status === 'done') {
                    setDone(true);
                    userGetScore(contestId).then((data) => {
                        setTime(data.data.time);
                        setScore(data.data.score);
                    })
                }
                const status = data.data.status;
                if(status === 'done') {
                    setDone(true);
                }
                const newHistory = structuredClone(history);
                for(let i = 0; i < newHistory.length; i++) {
                    newHistory[i].history = [];
                }
                
                const histories = data.data.history;

                for(let i = 0; i < histories.length; i++) {
                    const indexFound = newHistory.findIndex((item) => {
                        return item.problem === histories[i].problem;
                    })
                    if(indexFound > -1) {
                        newHistory[indexFound].history.push(histories[i]);
                    }
                }
                setHistory([...newHistory]);
                setLoading();
                // userGetContestHistory(contestId).then((data) => {
                //     const histories = data.data.history;

                //     for(let i = 0; i < histories.length; i++) {
                //         const indexFound = newHistory.findIndex((item) => {
                //             return item.problem === histories[i].problem;
                //         })
                //         if(indexFound > -1) {
                //             newHistory[indexFound].history.push(histories[i]);
                //         }
                //     }
                //     setHistory([...newHistory]);
                //     setLoading();
                // })
            })
        })
    },[])

    socket.on('')

    socket.on(AppObject.SOCKET_ACTIONS.HOOK_SUBMISSION, () => {
        if(isDone) return;
        const path = window.location.pathname;
        const contestId = path.split('/').at(-1);
        if(!contestId.match(new RegExp('^[a-f0-9]{24,24}$'))) {
           window.location.replace('/home');
        }
        const newHistory = structuredClone(history);
        for(let i = 0; i < newHistory.length; i++) {
            newHistory[i].history = [];
        }
        userGetContestHistory(contestId).then((data) => {
            const histories = data.data.history;

            for(let i = 0; i < histories.length; i++) {
                const indexFound = newHistory.findIndex((item) => {
                    return item.problem === histories[i].problem;
                })
                if(indexFound > -1) {
                    newHistory[indexFound].history.push(histories[i]);
                }
            }
            setHistory([...newHistory]);
        })
    })

    function filesChange(e, index) {
        if(isDone) return;
        const file = e.target.files[0];
        const newFiles = [];
        for(let i = 0; i < index; i++) {
            newFiles.push(files[i]);
        }
        newFiles.push(file);
        for(let i = index + 1; i < files.length; i++) {
            newFiles.push(files[i]);
        }
        setFiles([...newFiles]);
    }

    function handleSubmit(i, item) {
        if(isDone) return;
        const nameParts = files[i].name.split(".");
        let language = "";
        if(nameParts.length >= 2) {
            switch(nameParts.at(-1)){
                case "cpp": {
                    language = "cpp";
                    break;
                }
                case "java": {
                    language = "java";
                    break;
                }
                default: break;
            }
        }
        if(!language) {
            setToast(<Toaster message={"Unsupported file"} type="error"/>);
            return;
        }
        if(!item.problem) {
            setToast(<Toaster message={"Problem error"} type="error"/>);
            return;
        }
        socket.emit(AppObject.SOCKET_ACTIONS.SUBMIT_CONTEST, 
        {
            file: files[i],
            token: token,
            language: language,
            problem: item.problem,
            contest: detail._id,
        });
    }

    function finishContest() {
        confirmAlert({
            title: "Kết thúc bài thi",
            message: "Bạn có chắc chắn muốn kết thúc bài làm này ? Kết quả sẽ được ghi nhận và bạn không thể tiếp tục làm bài thi",
            buttons: [
              {
                label: "Đồng ý",
                onClick: () => {
                    socket.emit('finish', {
                        token: token,
                        contest: detail._id
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                },
              },
              {
                label: "Không",
              },
            ],
        });
    }

    const questionDetail = [];
    if(detail?.questions) {
        for(let i = 0; i < detail.questions.length; i++) {
            const item = detail.questions[i];
            questionDetail.push(
                <div key={i} className="question px-2 py-2">
                        <h4 className="m-0">
                            <strong>Câu hỏi {i + 1}: {item.problem.problemName} </strong>
                            <p className="badge badge-opacity-success">{item.score} điểm</p>
                        </h4>
                        <div className="content px-2 py-2" style={{border: '1px solid #e3e3e3'}}>
                            <div dangerouslySetInnerHTML={{ __html: item.problem.problemQuestion }}></div>
                            <h5>Đầu vào</h5>
                            <p>{item.problem.expectedInput || 'Không có yêu cầu đầu vào'}</p>
                            <h5>Đầu ra</h5>
                            <p>{item.problem.expectedOutput || 'Không có yêu cầu đầu ra'}</p>
                            <h5>Ví dụ</h5>    
                            <p className="m-0">Đầu vào</p>
                            <pre>{item.problem.example.input}</pre>
                            <p className="m-0">Đầu ra</p>
                            <pre>{item.problem.example.output}</pre>
                            <div className="submit-form text-right">
                                <label htmlFor={`index${i}`} className="w-75" style={{fontSize: '14px'}}>
                                    <span className="d-inline-block text-left" style={{padding: '5px 20px', width: '89%', border: '1px solid #e3e3e3', color: 'black'}}>{isDone ? 'Không thể upload do bài thi đã kết thúc': files[i]?.name || "Không có file nào được chọn"}</span>
                                </label>
                                { !isDone ?
                                <span className="d-inline-block text-center cursor" style={{ padding: '5px 0px', width: '9%', background: '#34b1aa', border: '1px solid #34b1aa', color: 'white', fontSize: '14px'}}
                                onClick={() => handleSubmit(i, item)}>Gửi bài</span>
                                : 
                                <span className="d-inline-block text-center cursor" style={{ padding: '5px 0px', width: '9%', background: '#e3e3e3', border: '3px solid #e3e3e3e', color: 'white', fontSize: '14px'}}>Kết thúc</span>
                                }
                                { 
                                !isDone ?
                                <input type="file" accept=".cpp,.java,.py" onChange={(e) => filesChange(e, i)} id={`index${i}`} style={{display: 'none'}}></input>
                                : null
                                }
                            </div>
                            <div className="history">
                                <h5 className="text-secondary">
                                    Lịch sử submit
                                    { !show[i] ?
                                    <i className="fa fa-caret-down mx-2" onClick={() => {show[i] = !show[i]; setShow([...show])}} aria-hidden="true"></i>
                                    :
                                    <i className="fa fa-caret-up mx-2" onClick={() => {show[i] = !show[i]; setShow([...show])}} aria-hidden="true"></i>
                                    }
                                </h5>
                                { show[i] ?
                                <ul className="m-0 p-0 border" style={{listStyle: 'none'}}>
                                    <li className="submission d-flex w-100 py-3 justify-content-center align-items-center" style={{background: '#f5f6f4'}}>
                                        <div style={{width: '25%'}} className="text-center">ID</div>
                                        <div style={{width: '25%'}} className="text-center">Tạo lúc</div>
                                        <div style={{width: '20%'}} className="text-center">Ngôn ngữ</div>
                                        <div style={{width: '10%'}} className="text-center">Thời gian thực thi</div>
                                        <div style={{width: '10%'}} className="text-center">Tỉ lệ qua</div>
                                        <div style={{width: '20%'}} className="text-center">Kết quả</div>
                                    </li>
                                    {
                                        history[i].history.map((item, index) => {
                                            return (
                                                <li key={index} className="submission d-flex w-100 py-3 justify-content-center align-items-center">
                                                    <div style={{width: '25%'}} className="text-center">{item._id}</div>
                                                    <div style={{width: '25%'}} className="text-center">{item.createdAt}</div>
                                                    <div style={{width: '20%'}} className="text-center">{item.language}</div>
                                                    <div style={{width: '10%'}} className="text-center">{item.executeTime}</div>
                                                    <div style={{width: '10%'}} className="text-center">{item.passPercent}%</div>
                                                    { item.status === 'Accepted' ?
                                                        <div style={{width: '20%'}} className="text-center text-success">{item.status}</div>
                                                    : 
                                                      item.status === 'pending' ? 
                                                      <div  style={{width: '20%'}} className="text-center">
                                                        <div style={{width: '20px',height: '20px'}} className="spinner-border text-primary" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                      </div>
                                                    :  <div style={{width: '20%'}} className="text-center text-danger">{item.status !== 'Time limited execeeded' ? item.status : 'TLE'}</div>
                                                    }   
                                                </li>
                                            )
                                        })
                                    }
                                </ul> 
                                : null }
                            </div>
                        </div>
                    </div>
            )
        }  
    }
    return (
        <>
            {loading}
            <NavigationBar scope="limited"/>
            {toast}
            <div className="container position-relative">
                <div className="container shadow my-2 mt-5 p-3">
                    <div className="point-info text-left">
                        { isDone ? <h5>Điểm đạt được: <span className="text-danger">{score}</span></h5> : null }
                        { isDone ? <p className="text-success">Thời gian làm bài: {time}</p> : null}
                    </div>
                    <div className="contest-info w-100 text-center" style={{lineHeight: '25px', fontWeight: 'bold'}}>
                        <h3 className="text-secondary">{detail?.name || 'No contest name found'}</h3>
                    </div>
                    {questionDetail}
                </div>
                { !isDone ?
                <div className="w-50 text-center m-auto">
                    <div className="my-2 btn btn-danger w-25" onClick={() => finishContest()}>Kết thúc</div>
                    <div className="my-2 btn btn-success w-25" onClick={() => window.location.replace('/home')}>Quay về</div>
                </div> :
                <div className="w-50 text-center m-auto">
                    <div className="my-2 btn btn-success w-25" onClick={() => window.location.replace('/home')}>Quay về</div>
                </div>
                } 
            </div>
            <Footer scope="limited"/>
        </>
    )
}