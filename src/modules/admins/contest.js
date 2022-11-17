import { useEffect, useState } from "react";
import { callChangeStatus, callGetContest } from "../../api/contest.api";
import { DELETE } from "../../configs/app.config";
import { FormType } from "../../helpers/object.helper";
import Form from "./form";

export default function Contest() {
    const [form, setForm] = useState(<></>);
    const [contest, setContest] = useState([]);
    function addContest() {
        console.log('add contest called');
        setForm(<Form type={FormType.CONTEST} closeForm={closeForm} />);
    }
    useEffect(()=>{
        getContest();
    },[])
    function getContest() {
        callGetContest().then((data) => {
            setContest(data.data.data);
        }).catch((err) => {
            console.log(err);
        }) 
    }       
    function closeForm() {
        getContest();
        setForm(<></>);
      }
    
    function calcStt(beginAt, duration) {
        const dbegin = new Date(beginAt);
        if(new Date() < dbegin) {
            return <span class="text-secondary">Coming</span>
        } 
        if(new Date() >= dbegin && new Date() <= new Date(beginAt).setHours(new Date(beginAt).getHours() + +duration)) {
            return <span class="text-success">Starting</span>
        }
        if(new Date() > new Date(beginAt).setHours(new Date(beginAt).getHours() + +duration)) {
            return <span class="text-danger">Closed</span>
        }
    }
    const handleContest = contest ? contest.map((item, index) => {
        return (
        <tr class="text-center">
            <td style={{ width: "10" }}>{item._id}</td>
            <td style={{ width: "25%" }}>{item.name}</td>
            <td style={{ width: "5%" }}>{new Date(item.beginAt).toLocaleString()}</td>
            <td style={{ width: "5%" }}>{item.limitedMember || 'No limit'}</td>
            <td style={{ width: "5%"}}>{item.duration}</td>
            <td style={{ width: "10%" }}>{calcStt(item.beginAt, item.duration)}</td>
            <td style={{ width: "10%" }}>{new Date(item.createdAt).toLocaleString()}</td>
            <td><div class="btn btn-success m-auto">Member</div></td>
        </tr>)
    }): null;
    return (
        <>
            {form}
            <div class="col-lg-12 grid-margin stretch-card">
                <div class="card">
                <div class="card-body">
                    <h4 class="card-title">Manage contest</h4>
                    <div class="d-flex justify-content-between">
                    <p class="card-description">
                        User will be enjoy contest for exams or bigger event
                    </p>
                    <button
                        onClick={() => addContest()}
                        type="button"
                        class="btn btn-primary btn-icon-text"
                    >
                        <i class="ti-plus btn-icon-prepend"></i>
                        Create new contest
                    </button>
                    </div>
                    <div class="table-responsive" style={{maxHeight: '600px', overflowY: 'scroll'}}>
                    <table class="table table-hover">
                        <thead>
                        <tr class="text-center">
                            <th style={{ width: "10" }}>ID</th>
                            <th style={{ width: "25%" }}>Contest name</th>
                            <th style={{ width: "5%" }}>Begin at</th>
                            <th style={{ width: "5%" }}>User Limit</th>
                            <th style={{ width: "5%"}}>Duration</th>
                            <th style={{ width: "10%" }}>Status</th>
                            <th style={{ width: "10%" }}>Created Time</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>{handleContest}</tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}