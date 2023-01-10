import { useEffect, useState } from "react";
import { callGetContest } from "../../api/contest.api";
import { FormType } from "../../helpers/object.helper";
import Form from "./form";
import { Loading } from "./loading";

export default function Contest() {
    const [form, setForm] = useState(<></>);
    const [contest, setContest] = useState([]);
    const [loading, setLoading] = useState();
    function addContest() {
        setForm(<Form type={FormType.CONTEST} closeForm={closeForm} />);
    }
    useEffect(()=>{
        getContest();
    },[])
    function getContest() {
        setLoading(<Loading/>)
        callGetContest().then((data) => {
            setContest(data.data.data);
        }).catch((err) => {
        }).finally(() => {
            setLoading();
        })
    }       
    function closeForm() {
        getContest();
        setForm(<></>);
      }
    
    function calcStt(beginAt, duration) {
        const dbegin = new Date(beginAt);
        if(new Date() < dbegin) {
            return <span className="text-secondary">Sắp tới</span>
        } 
        if(new Date() >= dbegin && new Date() <= new Date(beginAt).setHours(new Date(beginAt).getHours() + +duration)) {
            return <span className="text-success">Đang diễn ra</span>
        }
        if(new Date() > new Date(beginAt).setHours(new Date(beginAt).getHours() + +duration)) {
            return <span className="text-danger">Kết thúc</span>
        }
    }
    const handleContest = contest ? contest.map((item, index) => {
        return (
        <tr className="text-center">
            <td style={{ width: "10" }}>{item._id}</td>
            <td style={{ width: "25%" }}>{item.name}</td>
            <td style={{ width: "5%" }}>{new Date(item.beginAt).toLocaleString()}</td>
            <td style={{ width: "5%" }}>{item.limitedMember || 'Không giới hạn'}</td>
            <td style={{ width: "5%"}}>{item.duration}</td>
            <td style={{ width: "10%" }}>{calcStt(item.beginAt, item.duration)}</td>
            <td style={{ width: "10%" }}>{new Date(item.createdAt).toLocaleString()}</td>
            <td></td>
        </tr>)
    }): null;
    return (
        <>
            {form}
            <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Quản lý bài thi</h4>
                    <div className="d-flex justify-content-between">
                    <p className="card-description">
                        Nhiều người dùng có thể cùng tham gia và làm bài thi 
                    </p>
                    <button
                        onClick={() => addContest()}
                        type="button"
                        className="btn btn-primary btn-icon-text"
                    >
                        <i class="fa-regular fa-plus"></i>
                        Tạo bài thi mới
                    </button>
                    </div>
                    <div className="table-responsive" style={{maxHeight: '600px', overflowY: 'scroll'}}>
                    <table className="table table-hover">
                        <thead>
                        <tr className="text-center">
                            <th style={{ width: "10" }}>ID</th>
                            <th style={{ width: "25%" }}>Tên bài thi</th>
                            <th style={{ width: "5%" }}>Thời gian bắt đầu</th>
                            <th style={{ width: "5%" }}>Số người tối đa</th>
                            <th style={{ width: "5%"}}>Thời lượng (giờ)</th>
                            <th style={{ width: "10%" }}>Trạng thái</th>
                            <th style={{ width: "10%" }}>Thời gian tạo</th>
                            <th>Hoạt động</th>
                        </tr>
                        </thead>
                        <tbody>{handleContest}{loading}</tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}