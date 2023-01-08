import { useEffect, useState } from "react";
import { callRegister, userGetContest, userGetOwn } from "../../api/contest.api";
import Footer from "../commons/footer";
import { Loading } from "../commons/loading";
import NavigationBar from "../commons/navigation";
import { Toaster } from "../commons/toast";

export default function UserContest() {
    const [upcoming, setUpcomming] = useState([]);
    const [previous, setPrevious] = useState([]);
    const [current, setCurrent] = useState([]);
    const [toast, setToast] = useState(<></>);
    const [loading, setLoading] = useState();

    useEffect(() => {
        setLoading(<Loading/>);
        Promise.all([
            userGetContest(),
            userGetOwn('previous'),
            userGetOwn('current')
        ]).then((response) => {
            setUpcomming(response[0].data.data);
            setPrevious(response[1].data.data);
            setCurrent(response[2].data.data);
            setLoading();
        }).catch(() => {
            window.location.replace('/sign-in');
        })
        // userGetContest().then((data) => {
        //     setUpcomming(data.data.data);
        // })
        // userGetOwn('previous').then(data => {
        //     setPrevious(data.data.data);
        // })
        // userGetOwn('current').then(data => {
        //     setCurrent(data.data.data);
        // })
    }, []);

    function calcStt(beginAt, duration) {
        const dbegin = new Date(beginAt);
        if(new Date() < dbegin) {
            return <span className="text-secondary">Sắp tới</span>
        } 
        if(new Date() >= dbegin && new Date() <= new Date(beginAt).setHours(new Date(beginAt).getHours() + +duration)) {
            return <span className="text-success">Bắt đầu</span>
        }
        if(new Date() > new Date(beginAt).setHours(new Date(beginAt).getHours() + +duration)) {
            return <span className="text-danger">Kết thúc</span>
        }
    }

    function userRegister(id){
        callRegister(id).then(() => {
            setToast(<Toaster message="Register success" type="success"/>);
        }).catch((error) => {
            setToast(<Toaster message={error?.response?.data?.message || 'Server error'} type="error"/>)
        })
    }

    const upcommings = upcoming ? upcoming.map((item) => {
        return (
            <li className="d-flex my-1 justify-content-between align-items-center bg-light px-2 py-2">
                <div className="contest-stats w-50">
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>{item.name}</div>
                    <div>
                        <i className="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Người tham gia: {item.users}
                    </div>
                    <div>
                        <i className="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Còn lại: {item.remainMember}
                    </div>
                    <div>
                        Mô tả: {item.description}
                    </div>
                </div>
                <div>
                    {calcStt(item.beginAt, item.duration)}
                </div>
                { item.remainMember == 0 ?
                <div className="btn btn-secondary">
                    Đăng ký 
                </div>
                :
                <div className="btn btn-primary" onClick={() => userRegister(item._id)}>
                    Đăng ký 
                </div>
                }
            </li>
        )
    }) : null;

    const previousList = previous ? previous.map((item) => {
        return (
            <li className="d-flex my-1 justify-content-between align-items-center bg-light px-2 py-2">
                <div className="contest-stats w-50">
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>{item.name}</div>
                    <div>
                        <i className="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Người tham gia: {item.users}
                    </div>
                    <div>
                        <i className="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Còn lại: {item.remainMember === 'No limit' ? 'Không giới hạn' : item.remainMember}
                    </div>
                    <div>
                        Mô tả: {item.description}
                    </div>
                </div>
                <div>
                    {calcStt(item.beginAt, item.duration)}
                </div>
                <div className="btn btn-primary" onClick={() => window.location.replace(`/start/contest/${item._id}`)}>
                    Kết quả
                </div>
            </li>
        )
    }) : null;

    const currentList = current ? current.map((item) => {
        return (
            <li className="d-flex my-1 justify-content-between align-items-center bg-light px-2 py-2">
                <div className="contest-stats w-50">
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>{item.name}</div>
                    <div>
                        <i className="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Người tham gia: {item.users}
                    </div>
                    <div>
                        <i className="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Còn lại: {item.remainMember}
                    </div>
                    <div>
                        Mô tả: {item.description}
                    </div>
                </div>
                <div>
                    {calcStt(item.beginAt, item.duration)}
                </div>
                <div className="w-25 text-right">
                    { new Date(item.beginAt) > new Date() ?
                    <div className="btn btn-secondary w-50">
                        Vui lòng chờ 
                    </div>  : 
                    <div className="btn btn-success w-50" onClick={() => window.location.replace(`/start/contest/${item._id}`)}>
                        Tham gia 
                    </div>
                    }  
                </div> 
            </li>
        )
    }) : null;

    return (
    <>
        {loading}
        {toast}
        <NavigationBar />
            <div className="container">
                <div className="user-contest">
                </div>
                <div className="user-contest my-5">
                    { current?.length ? 
                    <div className="pl-3">
                        <div className="bg-main">
                            <h4 className="text-secondary mt-2">Bài thi của bạn</h4>
                            <ul className="m-0 p-0" style={{listStyle:'none'}}>
                                {currentList}
                            </ul>
                        </div>
                    </div>
                    :
                    <div className="w-100 d-flex bg-linear-main px-3 p-2 text-white">
                        <div className="w-50 p-0 px-5 d-flex justify-content-center flex-column align-items-start">
                            Bạn chưa đăng ký tham gia cuộc thi nào gần đây.<br/>
                            <div className="btn btn-danger mt-2"><strong>Đăng ký ngay !</strong></div>
                        </div>
                        <div className="w-50">
                            <img src="https://res.cloudinary.com/de6k85koo/image/upload/v1672847603/learning_kyzxeg.png"/>
                        </div>
                    </div>
                    }
                </div>
                <div className="w-100 list-contest mb-4">
                    <div className="w-100 row m-0">
                        <div className="col-md-8">
                            <h4 className="text-secondary">Bài thi sắp diễn ra</h4>
                            <ul className="m-0 p-0" style={{listStyle:'none'}}>
                                {upcommings?.length ? upcommings : <div className="text-center border py-5">Không có bài thi nào sắp diễn ra, vui lòng quay lại sau !</div>}
                            </ul>
                            <h4 className="text-secondary mt-2">Bài thi đã tham gia</h4>
                            <ul className="m-0 p-0" style={{listStyle:'none'}}>
                                {previous?.length ? previousList : <div className="text-center border py-5">Bạn chưa làm bài thi nào trước đó, hãy thử tham gia một bài thi nhé !</div>}
                            </ul>
                        </div>
                        <div className="col-md-4 p-0">
                            <img className="img-fluid w-100" src="https://www.blairsinger.com/wp-content/uploads/2022/07/Summit-Leadership-Ads-Vertical-Banner-1-300px-width.jpg"></img>
                        </div>
                    </div>
                </div>
            </div>
        <Footer/>
    </>
    )
}