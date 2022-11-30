import { useEffect, useState } from "react";
import { userGetDetailContest } from "../../api/contest.api";
import Footer from "../commons/footer";
import NavigationBar from "../commons/navigation";

export default function ContestOrganize() {
    const [detail, setDetail] = useState();
    const [show, setShow] = useState([]);
    useEffect(() => {
        const path = window.location.pathname;
        const contestId = path.split('/').at(-1);
        if(!contestId.match(new RegExp('^[a-f0-9]{24,24}$'))) {
           window.location.replace('/home');
        }
        userGetDetailContest(contestId).then((data) => {
            setDetail(data.data);
            const initShow = [];
            for(let i = 0; i < data.data.problem.length; i++) {
                initShow.push(false);
            }
            setShow(initShow);
        })
    })
    const questionDetail = [];
    if(detail?.questions) {
        for(let i = 0; i < detail.questions.length; i++) {
            const item = detail.questions[i];
            questionDetail.push(
                <div key={i} class="question px-2 py-2">
                        <h4 class="m-0">
                            <strong>Question {i + 1}: {item.problem.problemName} </strong>
                            <p class="badge badge-opacity-success">{item.score} point</p>
                        </h4>
                        <div class="content px-2 py-2" style={{border: '1px solid #e3e3e3'}}>
                            <div dangerouslySetInnerHTML={{ __html: item.problem.problemQuestion }}></div>
                            <h5>Input contrains</h5>
                            <p>No input</p>
                            <h5>Output expected</h5>
                            <p>No output</p>
                            <h5>Example</h5>    
                            <p class="m-0">Input</p>
                            <pre></pre>
                            <p class="m-0">Output</p>
                            <pre>hello world.</pre>
                            <div class="submit-form text-right">
                                <label htmlFor="id" class="w-75" style={{fontSize: '14px'}}>
                                    <span class="d-inline-block text-left" style={{padding: '5px 20px', width: '89%', border: '1px solid #e3e3e3', color: 'black'}}>No file choosen</span>
                                </label>
                                <span class="d-inline-block text-center cursor" style={{ padding: '5px 0px', width: '9%', background: '#34b1aa', border: '1px solid #34b1aa', color: 'white', fontSize: '14px'}}>Submit</span>
                                <input type="file" accept=".cpp,.java,.py" id="id" style={{display: 'none'}}></input>
                            </div>
                            <div class="history">
                                <h5 class="text-secondary">
                                    Submit history
                                    <i class="fa fa-caret-down mx-2" aria-hidden="true"></i>
                                    <i class="fa fa-caret-up mx-2" aria-hidden="true"></i>
                                </h5>
                                <ul class="m-0 p-0 border" style={{listStyle: 'none'}}>
                                    <li class="submission d-flex w-100 py-3 justify-content-center align-items-center" style={{background: '#f5f6f4'}}>
                                        <div style={{width: '25%'}} class="text-center">Submission ID</div>
                                        <div style={{width: '20%'}} class="text-center">User</div>
                                        <div style={{width: '25%'}} class="text-center">Timestamp</div>
                                        <div style={{width: '10%'}} class="text-center">Execute</div>
                                        <div style={{width: '20%'}} class="text-center">Result</div>
                                    </li>
                                    <li class="submission d-flex w-100 py-3 justify-content-center align-items-center">
                                        <div style={{width: '25%'}} class="text-center">12343234234323</div>
                                        <div style={{width: '20%'}} class="text-center">vmoder02</div>
                                        <div style={{width: '25%'}} class="text-center">16:09:00 26-11-2022</div>
                                        <div style={{width: '10%'}} class="text-center">0.0005s</div>
                                        <div style={{width: '20%'}} class="text-center text-danger">Wrong answer</div>
                                    </li>
                                    <li class="submission d-flex w-100 py-3 justify-content-center align-items-center">
                                        <div style={{width: '25%'}} class="text-center">12343234234323</div>
                                        <div style={{width: '20%'}} class="text-center">vmoder02</div>
                                        <div style={{width: '25%'}} class="text-center">16:09:00 26-11-2022</div>
                                        <div style={{width: '10%'}} class="text-center">0.0005s</div>
                                        <div style={{width: '20%'}} class="text-center text-success">Accepted</div>
                                    </li>
                                </ul> 
                            </div>
                        </div>
                    </div>
            )
        }  
    }
    return (
        <>
            <NavigationBar scope="limited"/>
            <div class="container">
                <div class="container shadow my-2 mt-5 p-3">
                    <div class="point-info text-left">
                        <div class="point d-inline-block position-relative text-center" style={{border: '2px solid black', width: '100px', height: '100px'}}>
                            <h5 class="position-absolute bg-white px-1" style={{top: '-5px', left: '50%', transform: 'translateX(-50%)'}}>Point</h5>
                            <h2 class="point text-danger" style={{lineHeight: '100px'}}>100</h2>
                        </div>
                    </div>
                    <div class="contest-info w-100 text-center" style={{lineHeight: '25px', fontWeight: 'bold'}}>
                        <h3 class="text-secondary">{detail?.name || 'No contest name found'}</h3>
                    </div>
                    {questionDetail}
                </div>
                <div class="w-50 text-center m-auto">
                    <div class="my-2 btn btn-success w-25">Finish</div>
                    <div class="my-2 btn btn-danger mx-1 w-25">Exit contest</div>
                </div>
            </div>
            <Footer scope="limited"/>
        </>
    )
}