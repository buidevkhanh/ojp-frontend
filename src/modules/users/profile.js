import { useEffect, useRef, useState } from "react";
import { userGetInfor, userGetRanking, userUpdateInfo } from "../../api/user.api";
import { callSingleUpload } from "../../api/upload.api";
import Footer from "../commons/footer";
import NavigationBar from "../commons/navigation";
import { Toaster } from "../commons/toast";

export default function Profile() {
    const [profile, setProfile] = useState();
    const [file, setFile] = useState();
    const [toast, setToast] = useState(<></>);
    const [ranking, setRanking] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const dname = useRef();
    const dob = useRef();
    const email = useRef();
    const ognz = useRef();

    function handleFileChange(e) {
        const newFile = e.target.files[0];
        callSingleUpload({file: newFile}).then((data) => {
            const path = data.data.url;;
            userUpdateInfo({avatar: path}).then(() => {
                userGetInfor().then((data)=>{
                    setProfile(data.data);
                }).catch((error) => {
                    window.location.replace('/sign-in');
                })
            })
        }).catch((error) => {
            setToast(<Toaster message={'Upload failure'} type="error"/>);
        })
        setFile(null);
    }

    function handleUpload() {
        const upload = document.querySelector('#upload');
        upload.click();
    }

    function getNormalDate(date) {
        const d = date.toISOString();
        const dParts = d.split("T")[0].split("-");
        return `${dParts[0]}-${dParts[1]}-${dParts[2]}`;
    }

    function unlockEdit(){
        const list = document.querySelectorAll('.canEdit');
        list.forEach((item) => {
            item.removeAttribute('readonly');
            item.setAttribute('style','background-color: white !important; border: 1px solid #e3e3e3 !important');
        })
        setIsEdit(true);
    }

    function updateProfile(){
        const dnameTxt = dname.current.value;
        const emailTxt = email.current.value;
        const dobTxt = dob.current.value;
        const ogTxt = ognz.current.value;
        if(dnameTxt === '') {
            setToast(<Toaster message={'display name can not be blank'} type="error"/>);
            return;
        }
        if(emailTxt === '') {
            setToast(<Toaster message={'email name can not be blank'} type="error"/>);
            return;
        }
        userUpdateInfo({userEmail: emailTxt || null, displayName: dnameTxt || null, dateOfBirdth: dobTxt || null, organization: ogTxt || null}).then(() => {
            userGetInfor().then((data)=>{
                setProfile(data.data);
                const list = document.querySelectorAll('.canEdit');
                list.forEach((item) => {
                    item.setAttribute('readonly', null);
                    item.removeAttribute('style');
                })
                setIsEdit(false);
            }).catch((error) => {
                console.log(error);
                // window.location.replace('/sign-in');
            })
        })
    }

    useEffect(() => {
        userGetInfor().then((data)=>{
            setProfile(data.data);
            console.log(data);
            userGetRanking().then((data) => {
                setRanking(data.data.data);
            })
        }).catch((error) => {
            window.location.replace('/sign-in');
        })
    },[]);

    function cancelUpdate() {
        userGetInfor().then((data)=>{
            setProfile(data.data);
            dname.current.value = data.data.displayName;
            dob.current.value = getNormalDate(new Date(data.data.dateOfBirdth));
            email.current.value = data.data.userEmail;
            ognz.current.value = data.data.organization;
            const list = document.querySelectorAll('.canEdit');
            list.forEach((item) => {
                item.setAttribute('readonly', null);
                item.removeAttribute('style');
            })
            setIsEdit(false);
        });
    }

    return (
        <>
            <NavigationBar/>
            {toast}
            { profile  && ranking ? 
            <div class="container my-5">
                <div class="row">
                    <div class="col-md-4 text-center">
                        <div class="d-inline-block" style={{width: '200px', height: '200px', borderRadius: '50%', overflow: 'hidden'}}>
                            <div class="d-inline-block position-relative" style={{width: '200px', height: '200px', borderRadius: '50%', backgroundRepeat: 'no-repeat', backgroundSize: 'contain'}}>
                                <img width="200px" height="200px" src={profile ? profile.avatar : null} alt="avatar"/>
                                <div class="change-img position-absolute text-center w-100 py-2" style={{backgroundColor: 'rgba(0,0,0,0.25)', bottom: '0px', zIndex: '100'}}>
                                    <i class="fas fa-camera text-center text-white" onClick={() => handleUpload()} style={{fontSize: '20px'}}></i>
                                </div>
                            </div>
                        </div>
                        <input type="file" ref={file} onChange={(e) => handleFileChange(e)} accept="image/*" style={{width: 0, height: 0, visibility: 'hidden'}} id="upload"/>
                        <p class="m-0 p-0 mt-2 text-center">{profile ? profile.username : 'Unknow username' }</p>
                        <h4 class="m-0 p-0 my-1 text-conter bold">{profile ? profile.displayName : "Unknow display name"}</h4>
                    </div>
                    <div class="col-md-8 text-start border rounded py-4 px-4 bg-light">
                        <h3 class="m-0 p-0 text-secondary pb-3" style={{fontWeight: 'bold'}}>User Profile</h3>
                        <div class="prf-info d-flex justify-content-between align-items-center my-2">
                            <span class="d-inline-block w-50">Username </span>: 
                            <input id="prfUsname" class="custome-input-3 w-100 mx-2 py-2 px-2 bg-light" readOnly defaultValue={profile ? profile.username : 'Unknow username'}></input>
                        </div> 
                        <div class="prf-info d-flex justify-content-start align-items-center my-2">
                            <span class="d-inline-block w-50">Display name </span>: 
                            <input ref={dname} class="canEdit custome-input-3 w-100 mx-2 py-2 px-2 bg-light" readOnly defaultValue={profile ? profile.displayName : 'Unknow display name'}></input>
                        </div> 
                        <div class="prf-info d-flex justify-content-start align-items-center my-2">
                            <span class="d-inline-block w-50">Email </span>: 
                            <input ref={email} class="canEdit custome-input-3 w-100 mx-2 py-2 px-2 bg-light" readOnly defaultValue={profile ? profile.userEmail : 'Unknow email'}></input>
                        </div> 
                        <div class="prf-info d-flex justify-content-start align-items-center my-2">
                            <span class="d-inline-block w-50">Date of bidth </span>: 
                            <input ref={dob} class="canEdit custome-input-3 w-100 mx-2 py-2 px-2 bg-light" type="date" readOnly defaultValue={profile.dateOfBirdth ? getNormalDate(new Date(profile.dateOfBirdth)) : null}></input>
                        </div> 
                        <div class="prf-info d-flex justify-content-start align-items-center my-2">
                            <span class="d-inline-block w-50">Join date <small>(yyyy-mm-dd)</small></span>: 
                            <input class="custome-input-3 w-100 mx-2 py-2 px-2 bg-light" readOnly defaultValue={profile ? profile.createdAt.split('Z')[0].split('T')[0] : 'Invalid date'}></input>
                        </div> 
                        <div class="prf-info d-flex justify-content-start align-items-center my-2">
                            <span class="d-inline-block w-50">Total score</span>: 
                            <input class="custome-input-3 w-100 mx-2 py-2 px-2 bg-light" readOnly defaultValue={profile.score}></input>
                        </div>
                        <div class="prf-info d-flex justify-content-start align-items-center my-2">
                            <span class="d-inline-block w-50">Practice times</span>: 
                            <input class="custome-input-3 w-100 mx-2 py-2 px-2 bg-light" readOnly defaultValue={profile.practiceTime}></input>
                        </div>
                        <div class="prf-info d-flex justify-content-start align-items-center my-2">
                            <span class="d-inline-block w-50">Accepted problems</span>: 
                            <input class="custome-input-3 w-100 mx-2 py-2 px-2 bg-light" readOnly defaultValue={profile.passProblem}></input>
                        </div>
                        <div class="prf-info d-flex justify-content-start align-items-center my-2">
                            <span class="d-inline-block w-50">Ranking</span>: 
                            <input class="custome-input-3 w-100 mx-2 py-2 px-2 bg-light" readOnly defaultValue={ranking ? ranking : 'Loading'}></input>
                        </div>
                        <div class="prf-info d-flex justify-content-start align-items-center my-2">
                            <span class="d-inline-block w-50">Organization</span>: 
                            <input ref={ognz} class="canEdit custome-input-3 w-100 mx-2 py-2 px-2 bg-light" readOnly defaultValue={profile.organization ? profile.organization : null} placeholder={'Organization name'}></input>
                        </div>
                        <div class="edit-region text-center mt-4">
                            { isEdit ? 
                                 <div class="text-center w-100">
                                    <div class="btn btn-success mx-1 w-25" onClick={() => updateProfile()}>
                                        <span>Save profile</span>
                                    </div>
                                    <div class="btn btn-secondary mx-1 w-25" onClick={() => cancelUpdate()}>
                                        <span>Cancel</span>
                                    </div>
                                </div>
                                :
                                <div class="btn btn-success" onClick={() => unlockEdit()}>
                                    <i class="fas fa-cogs mx-1"></i>
                                    <span>Edit profile</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div> : null}
            <Footer/>
        </>
    )
}