import { useRef, useState } from "react";
import { callCreateContest } from "../../../api/contest.api";
import { callGetProblem } from "../../../api/problem.api";
import { Toaster } from "../../commons/toast";

export default function ContestForm(props) {
    const name = useRef();
    const visible = useRef();
    const description = useRef();
    const beginAt = useRef();
    const duration = useRef();
    const [query, setQuery] = useState();
    const [select, setSelect] = useState([]);
    const [id, setId] = useState();
    const [pname, setName] = useState();
    const [point, setPoint] = useState();
    const [result, setResult] = useState([]);
    const [total, setTotal] = useState(0);
    const [toast, setToast] = useState(<></>);
    const [isLimit, setIsLimit] = useState(true);
    const limit = useRef();

    function addContest() {
        const cname = name.current.value;
        const cvisi = visible.current.value;
        const cdesc = description.current.value;
        const cbeat = beginAt.current.value;
        const cdura = duration.current.value;
        const cquestion = select.map((item, index) => {
            return { problem: item.id, score: item.point}
        });

        if(!cname) {
            setToast(<Toaster message={"Name can not be blank"} type="error"/>);
            return;
        }
        if(!cdesc) {
            setToast(<Toaster message={"Please fill description for contest"} type="error"/>);
            return;
        }
        if(!cbeat) {
            setToast(<Toaster message={"Begin time can not be blank"} type="error"/>);
            return;
        }
        if(!cdura) {
            setToast(<Toaster message={"Duration can not be blank"} type="error"/>);
            return;
        }
        if(cquestion.length < 1) {
            setToast(<Toaster message={"Number of question can not equals zero"} type="error"/>);
            return;
        }

        callCreateContest({ 
            name: cname, 
            visibility: cvisi, 
            description: cdesc, 
            beginAt: cbeat, 
            duration: cdura, 
            limitedMember: isLimit ? +limit.current.value : null,
            questions: cquestion}).then(() => {
                setToast(<Toaster message={"Create contest success"} type="success"/>);
                props.closeForm();
        }).catch((error) => {
            setToast(<Toaster message={error?.response?.data?.message || "Create contest error, please try laster"} type="error"/>)
        })

    }

    function handleInputChange(event) {
        setQuery(event.target.value);
        callGetProblem(1,event.target.value).then((data) => {
            setResult(data.data.data);
        })
    }

    function handlePreview(content) {
        const preview = document.querySelector('#contest__problem__preview');
        preview.innerHTML = content.problemQuestion ;
        setQuery(null);
        setId(content._id);
        setName(content.problemName);
        setPoint(1);
    }

    function remove(index) {
        const newSelect = [...select.slice(0,index), ...select.slice(index+1)];
        setSelect([...newSelect]);
    }

    function handlePointChange(event, index) {
        const point = event.target.value;
        if(point) {
            const selected = select.map((item, sindex) => {
                if(index === sindex) {
                    item = { name: item.name, id: item.id, point: +point}
                }
                return item;
            })
            setSelect([...selected]);
        }
    }

    const handleProblem = result ? result.map((item, index) => {
        return (
            <li class="search__item" key={index} onClick={() => handlePreview(item)}>{item.problemName}</li>
        )
    }): null;

    const handleSelect = select ? select.map((item, index) => {
        return (
            <tr class="text-center" key={index}>
                <td style={{width: '75%'}}>{item.name}</td>
                <td style={{width: '10%'}}>
                    <input class="w-75 text-center" onChange={(event) => handlePointChange(event,index)} type="number" defaultValue={1}></input>
                </td>
                <td style={{width: '15%'}}>
                    <div class="btn btn-danger m-0" onClick={() => remove(index)}>Remove</div>
                </td>
            </tr>
        )
    }) : null;

    const tt = select?.reduce((total, item) => {
        return total + item.point;
    }, 0);

    if(tt !== total) setTotal(tt);

    function selectProblem(){
        if(select.findIndex((item, index) => {
            return item.id === id;
        }) === -1) {
            setSelect([...select, {name: pname, id, point}]);
        } else {
            setToast(<Toaster message={"Already selected"} type="error"/>)
        }
    }

    return (
    <>
        {toast}
        <div class="w-100">
            <div class="bg-white w-100" style={{height: '100vh'}}>
            <div class="w-100 p-5">
                <div>
                <h4 class="card-title">{props.title}</h4>
                <p class="card-description">{props.description}</p>
                <div class="w-100 d-flex justify-content-between align-items-start">
                    <form class="forms-sample w-50 px-5">
                        <div class="form-group">
                        <label for="exampleInputName1">Contest's name</label>
                        <input
                            ref={name}
                            type="text"
                            class="form-control"
                            placeholder="Input contest name"
                        />
                        </div>
                        <div class="d-flex flex-column justify-content-center align-items-center">
                            <div class="form-group w-100">
                            <label>Contest visible</label>
                            <select
                                ref={visible}
                                class="form-control"
                                defaultValue={"public"}
                            >
                                <option value={"public"}>Public</option>
                                <option value={"private"}>Only designed user</option>
                            </select>
                            </div>
                            <div class="form-group w-100">
                            <label>Contest member limit</label>
                            <div class="d-flex justify-content-end mb-2">
                                { isLimit ? <span onClick={() => setIsLimit(!isLimit)} class="btn btn-success m-0" style={{borderRadius: '0 !important'}}>On</span> : <span onClick={() => setIsLimit(!isLimit)} class="btn btn-secondary m-0" style={{borderRadius: '0 !important'}}>Off</span> }
                            </div>
                            { isLimit ? 
                            <input ref={limit} defaultValue={1} type="text" class="custom__input__1 w-100 mb-0"></input>
                            : <input ref={limit} defaultValue={1} type="text" disabled class="custom__input__1 w-100 mb-0"></input> }
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea
                            ref={description}
                            placeholder="Description will be visible like introduce for this contest"
                            class="form-control mb-0"
                            rows="4"
                            ></textarea>
                        </div>
                        <div class="d-flex justify-content-center align-items-center">
                        <div class="form-group w-50 mr-1 mb-2">
                            <label for="exampleTextarea1">Begin at</label>
                            <input type="datetime-local" class="form-control mb-0" ref={beginAt}></input>
                        </div>
                        <div class="form-group w-50 ml-1 mb-2">
                            <label for="exampleTextarea1">Duration(hour)</label>
                            <input ref={duration} type="number" class="form-control mb-0" defaultValue={1}></input>
                        </div>
                        </div>
                        <div class="mt-3"></div>
                        <label style={{fontSize: '13px'}}>Search problem</label>
                        <div class="form-group d-flex">
                            <div class="w-100 dynamic__search position-relative">
                                <input type="text" onChange={(event) => handleInputChange(event)} class="custom__input__1 w-100 mb-0" placeholder="Enter problem name"></input>
                                {query?.trim() ? 
                                    <ul class="dynamic__result position-absolute top-25 border w-100 p-0" style={{listStyle:'none', zIndex: '1000', backgroundColor: 'white'}}>
                                        {handleProblem?.length > 0 ? handleProblem : <div class="text-center py-2">No problem found</div>}
                                    </ul> : null 
                                }
                            </div>
                        </div>
                        <label style={{fontSize: '13px'}}>Problem preview</label>
                        <div class="form-group d-flex">
                            <div class="w-100">
                                <div class="w-100 custom__textarea__1" id="contest__problem__preview" style={{height: '175px'}}>

                                </div>
                                <div class="w-100 text-end mt-2">
                                    <div class="btn btn-info" onClick={() => selectProblem( )}>Select</div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="w-50 px-5">
                        <label style={{fontSize: '13px'}}>Contest review</label><br></br>
                        <label style={{fontSize: '13px', fontWeight: 'bold'}} class="text-end d-block">total: {total} points</label>
                        <div class="contest__preview" style={{height: '700px', fontSize: '14px', overflowY: 'scroll'}}>
                            <div class="table table-bordered">
                                <thead>
                                    <tr class="text-center">
                                        <th style={{width: '75%'}}>Problem</th>
                                        <th style={{width: '5%'}}>Point</th>
                                        <th style={{width: '20%'}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   {handleSelect}
                                </tbody>
                            </div>
                        </div>
                        <div class="text-end mt-5">
                            <span
                            onClick={() => addContest()}
                            type="submit"
                            class="btn text-white btn-primary me-2"
                            >
                            Submit
                            </span>
                            <span class="btn btn-light" onClick={() => props.closeForm()}>
                            Cancel
                            </span>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    </>
    )
}