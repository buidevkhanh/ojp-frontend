import { useEffect, useState } from "react";
import { getTop, userGetRanking } from "../../api/user.api";
import Footer from "../commons/footer";
import { Loading } from "../commons/loading";
import NavigationBar from "../commons/navigation";

export default function Ranking() {
    const [me, setMe] = useState();
    const [rank, setRank] = useState();
    const [loading, setLoading] = useState();
    useEffect(() => {
        setLoading(<Loading/>);
        userGetRanking().then((data) => {
            setMe(data.data.data);
        });
        getTop().then((data) => {
            setLoading();
            setRank(data.data);
        })
    }, []); 
    const handleRanking = rank ? rank.map((item, index) => {
        return (
            <div key={index} className="w-100 d-flex justify-content-center align-items-center" style={{height: '50px'}}>
                <div style={{width: '10%'}} className="text-center">
                    <h3 className="m-0 p-0">{index + 1}</h3>
                </div>
                <div style={{width: '50%'}} className="text-center">
                    {item.name}
                </div>
                <div style={{width: '20%'}} className="text-center">
                    {item.practiceTime}
                </div>
                <div style={{width: '10%'}} className="text-center">
                    {item.passProblem}
                </div>
                <div style={{width: '10%'}} className="text-center">
                    {item.score}
                </div>
            </div>
        )
    }): null;
    return (
        <>
            {loading}
            <NavigationBar/>
            <div className="container my-4">
                <div>
                    <h3><i className="fas fa-crown mx-1"></i>Xếp hạng thành viên</h3>
                    <div className="my-4 row">
                        <div className="col-md-10 border py-4">
                            <div className="w-100 mb-4 d-flex justify-content-center align-items-center">
                                <div style={{width: '10%'}} className="text-center">
                                    <h5 className="m-0 p-0">Thứ hạng</h5>
                                </div>
                                <div style={{width: '50%'}} className="text-center">
                                    <h5 className="m-0 p-0">Thành viên</h5>
                                </div>
                                <div style={{width: '20%'}} className="text-center">
                                    <h5 className="m-0 p-0">Số submit</h5>
                                </div>
                                <div style={{width: '10%'}} className="text-center">
                                    <h5 className="m-0 p-0">Số bài đạt</h5>
                                </div>
                                <div style={{width: '10%'}} className="text-center">
                                    <h5 className="m-0 p-0">Số điểm</h5>
                                </div>
                            </div>
                            {handleRanking}
                        </div>
                        { me ?
                        <div className="col-md-2">
                           <p>Thứ hạng của bạn: {me}</p>
                           <p>{ me <= 50 ? 'Xin chúc mừng' : 'Hãy cố gắng bạn nhé'}</p>
                        </div>
                        : null }
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}