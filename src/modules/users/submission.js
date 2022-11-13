import { useEffect, useState } from 'react';
import NavigationBar from '../commons/navigation';
import Footer from '../commons/footer';
import io from 'socket.io-client';
import { SOCKET_HOST } from '../../configs/app.config';
import { AppObject } from '../../configs/app.object';
import { getSubmission } from '../../api/submission.api';
import { BarLoader } from 'react-spinners';

const socket = io(SOCKET_HOST);

export default function UserSubmission(props) {
    const [page, setPage] = useState(1);
    const [submission, setSubmission] = useState([]);
    const [totalPage, setTotal] = useState(1);
    const [filter, setFilter] = useState(0);

    useEffect(() => {   
        setFilter(window.location.pathname.split("?auth=")[1] == 'me' ? 1 : 0);
        getSubmission(page, window.location.pathname.split("?auth=")[1] == 'me' ? 'me': null).then((data) => {
            setSubmission(data.data.data);
            setTotal(data.data.totalPage);
        })
        socket.on(AppObject.SOCKET_ACTIONS.HOOK_SUBMISSION, (data) => {
            if(page === 1) {
                getSubmission(page, props.author).then((data) => {
                    setSubmission(data.data.data);
                });
            }
        })
    }, []);
    
    function changePage(delta) {
        if(delta > 0 && delta <= totalPage) {
            getSubmission(delta, filter == 0 ? null : 'me').then((data) => {
                setSubmission(data.data.data);
                setTotal(data.data.totalPage);
            })
            setPage(delta);
        }
    }

    function convertTime(input){
        input = input.split('T').join(" ").split("Z").join("").split(".")[0];
        const date = input.split(" ")[0].split("-");
        input = input.split(" ")[1] + " " + date[2] + "-" + date[1] + "-" + date[0];
        return  input;
    }

    function changeFilter(value) {
        setFilter(value);
        getSubmission(page, value === 0 ? null : 'me').then((data) => {
            setSubmission(data.data.data);
            setTotal(data.data.totalPage);
        })
    }

    const renderSubmit = submission ? submission.map((item, index) => {
        let bg = "bg-danger text-white";
        if(item.status === 'Accepted') {
            bg  = "bg-success text-white";
        }
        else if( item.status === 'Compile error') {
            bg = "bg-secondary text-dark";
        } else if (item.status === 'pending') {
            bg = "bg-white text-dark";
        }
        return (
            <tr key ={index} class="text-center">
                <td style={{ width: "5%", fontWeight: 'bold' }} class={`flex-column d-flex jutify-content-center align-items-center  w-100 ${bg}`}>
                    {
                    item.status === 'pending' ? 
                        <BarLoader
                        color="#36d7b7"
                        speedMultiplier={1.2}
                        width={80}
                        /> : 
                    item.status === 'Time Limited Execeeded' ? "TLE" : item.status
                    }
                    <p class="my-0 mt-2">
                        <span class={item.status === 'pending' ? "text-dark" : "text-white"}>{ item.status === 'pending' ? 'Running test' : <ins>Edit</ins>}</span>
                    </p>
                </td>
                <td style={{ width: "25%"}}>{item.problem.problemName}</td>
                <td>{item.user.displayName}</td>
                <td style={{ width: "5%" }}>{item.status === 'pending' ? "Waiting" : item.executeTime}</td>
                <td style={{ width: "5%" }}>{item.status === 'pending' ? "Waiting" : item.memory}</td>
                <td style={{ width: "5%" }}>{item.status === 'pending' ? "Wating" : item.passPercent}</td>
                <td style={{ width: "5%" }}>{convertTime(item.createdAt)}</td>
            </tr>
        )
    }): null;
    return (
        <>
            <NavigationBar/>
            <div class="container">
                <h3 class="mt-5 text-secondary">Submissions</h3>
                <div class="text-right my-1 mb-3 submission__switch">
                    <div style={{display: 'inline-block', fontSize: '14px',border: '1px solid #e3e3e33', backgroundColor: '#dfdfdf', color: '#a3a3a3', width: '70px', textAlign: 'center'}} onClick={()=> changeFilter(0)} class={filter == 0 ? 'py-1 cursor switch__active' : 'py-1 cursor'}>All</div>
                    <div style={{display: 'inline-block',fontSize: '14px', border: '1px solid #e3e3e33', backgroundColor: '#dfdfdf', color: '#a3a3a3', width: '70px', textAlign: 'center'}} onClick={()=> changeFilter(1)} class={filter == 1 ? 'py-1 cursor switch__active' : 'py-1 cursor'}>You</div>
                </div>
                <div class="row mb-5">
                    <div class="col-md-12">
                        <div class="table border cursor" style={{overflowX: 'auto'}}>
                        <thead>
                            <tr class="text-center">
                            <th style={{ width: "5%" }}>STATUS</th>
                            <th style={{ width: "25%"}}>PROBLEM</th>
                            <th>USER</th>
                            <th style={{ width: "5%" }}>TIME (s)</th>
                            <th style={{ width: "5%" }}>MEM</th>
                            <th style={{ width: "5%" }}>PASS (%)</th>
                            <th style={{ width: "5%" }}>TIMESTAMP</th>
                            </tr>
                        </thead>
                        <tbody>
                            { renderSubmit }
                        </tbody>
                        </div>
                        {+totalPage > 1 ? (
                        <nav aria-label="navigation mt-2">
                            <ul class="pagination mt-2 text-center d-flex justify-content-center">
                            {page - 1 > 0 ? (
                                <li onClick={() => changePage(page - 1)} class="page-item">
                                <span class="page-link" href="#">
                                    Pre
                                </span>
                                </li>
                            ) : null}
                            <li class="page-item">
                                <span
                                class="page-link"
                                style={{
                                    fontWeight: "bold",
                                    backgroundColor: "#e9ecef",
                                }}
                                >
                                {page}
                                </span>
                            </li>

                            {page + 1 <= totalPage ? (
                                <li onClick={() => changePage(page + 1)} class="page-item">
                                <span class="page-link">{page + 1}</span>
                                </li>
                            ) : null}
                            {page + 2 <= totalPage ? (
                                <li onClick={() => changePage(page + 2)} class="page-item">
                                <span class="page-link">{page + 2}</span>
                                </li>
                            ) : null}
                            </ul>
                        </nav>
                        ) : null}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
