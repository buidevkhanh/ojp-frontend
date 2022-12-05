import { useEffect, useState } from "react";
import { callRegister, userGetContest, userGetOwn } from "../../api/contest.api";
import Footer from "../commons/footer";
import NavigationBar from "../commons/navigation";
import { Toaster } from "../commons/toast";

export default function UserContest() {
    const [upcoming, setUpcomming] = useState([]);
    const [previous, setPrevious] = useState([]);
    const [current, setCurrent] = useState([]);
    const [toast, setToast] = useState(<></>);

    useEffect(() => {
        userGetContest().then((data) => {
            setUpcomming(data.data.data);
        })
        userGetOwn('previous').then(data => {
            setPrevious(data.data.data);
        })
        userGetOwn('current').then(data => {
            setCurrent(data.data.data);
        })
    }, []);

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

    function userRegister(id){
        callRegister(id).then(() => {
            setToast(<Toaster message="Register success" type="success"/>);
        }).catch((error) => {
            setToast(<Toaster message={error?.response?.data?.message || 'Server error'} type="error"/>)
        })
    }

    const upcommings = upcoming ? upcoming.map((item) => {
        return (
            <li class="d-flex my-1 justify-content-between align-items-center bg-light px-2 py-2">
                <div class="contest-stats w-50">
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>{item.name}</div>
                    <div>
                        <i class="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Participants: {item.users}
                    </div>
                    <div>
                        <i class="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Remain: {item.remainMember}
                    </div>
                    <div>
                        Description: {item.description}
                    </div>
                </div>
                <div>
                    {calcStt(item.beginAt, item.duration)}
                </div>
                { item.remainMember == 0 ?
                <div class="btn btn-secondary">
                    Register 
                </div>
                :
                <div class="btn btn-primary" onClick={() => userRegister(item._id)}>
                    Register 
                </div>
                }
            </li>
        )
    }) : null;

    const previousList = previous ? previous.map((item) => {
        return (
            <li class="d-flex my-1 justify-content-between align-items-center bg-light px-2 py-2">
                <div class="contest-stats w-50">
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>{item.name}</div>
                    <div>
                        <i class="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Participants: {item.users}
                    </div>
                    <div>
                        <i class="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Remain: {item.remainMember}
                    </div>
                    <div>
                        Description: {item.description}
                    </div>
                </div>
                <div>
                    {calcStt(item.beginAt, item.duration)}
                </div>
                <div class="btn btn-primary" onClick={() => window.location.replace(`/start/contest/${item._id}`)}>
                    View result
                </div>
            </li>
        )
    }) : null;

    const currentList = current ? current.map((item) => {
        return (
            <li class="d-flex my-1 justify-content-between align-items-center bg-light px-2 py-2">
                <div class="contest-stats w-50">
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>{item.name}</div>
                    <div>
                        <i class="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Participants: {item.users}
                    </div>
                    <div>
                        <i class="fa fa-users mx-1 text-secondary" aria-hidden="true"></i>Remain: {item.remainMember}
                    </div>
                    <div>
                        Description: {item.description}
                    </div>
                </div>
                <div>
                    {calcStt(item.beginAt, item.duration)}
                </div>
                <div class="w-25 text-right">
                    { new Date(item.beginAt) > new Date() ?
                    <div class="btn btn-secondary w-50">
                        Waiting 
                    </div>  : 
                    <div class="btn btn-success w-50" onClick={() => window.location.replace(`/start/contest/${item._id}`)}>
                        Join 
                    </div>
                    }  
                </div> 
            </li>
        )
    }) : null;

    return (
    <>
        {toast}
        <NavigationBar />
            <div class="container">
                <div class="user-contest">
                </div>
                <div class="user-contest my-5">
                    { current?.length ? 
                    <div class="pl-3">
                        <div class="bg-main">
                            <h4 class="text-secondary mt-2">Your contest</h4>
                            <ul class="m-0 p-0" style={{listStyle:'none'}}>
                                {currentList}
                            </ul>
                        </div>
                    </div>
                    :
                    <div class="w-100 d-flex bg-linear-main px-3 p-2 text-white">
                        <div class="w-50 p-0 px-5 d-flex justify-content-center flex-column align-items-start">
                            You have not registered to perticipate in any contest yet.<br/>
                            <div class="btn btn-danger mt-2"><strong>Register now !</strong></div>
                        </div>
                        <div class="w-50">
                            <img src="https://3rhxcj3e1iab1odg58u7zxfm-wpengine.netdna-ssl.com/wp-content/uploads/2021/08/resources_banner.png"/>
                        </div>
                    </div>
                    }
                </div>
                <div class="w-100 list-contest mb-4">
                    <div class="w-100 row m-0">
                        <div class="col-md-8">
                            <h4 class="text-secondary">Contest upcomming</h4>
                            <ul class="m-0 p-0" style={{listStyle:'none'}}>
                                {upcommings?.length ? upcommings : <div class="text-center border py-5">No upcoming contest, please try laster !</div>}
                            </ul>
                            <h4 class="text-secondary mt-2">Previous contest</h4>
                            <ul class="m-0 p-0" style={{listStyle:'none'}}>
                                {previous?.length ? previousList : <div class="text-center border py-5">No previous contest, try to participate in an any contest !</div>}
                            </ul>
                        </div>
                        <div class="col-md-4 p-0">
                            <img class="img-fluid w-100" src="https://www.blairsinger.com/wp-content/uploads/2022/07/Summit-Leadership-Ads-Vertical-Banner-1-300px-width.jpg"></img>
                        </div>
                    </div>
                </div>
            </div>
        <Footer/>
    </>
    )
}