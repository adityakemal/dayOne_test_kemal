import React, { useEffect} from 'react';
import { Button, Col, Row, Select } from 'antd';
import { Edit2, Trash2 } from 'react-feather';
import firebase from "../../firebase";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { useParams } from "react-router-dom";
import Loading from '../shared/Loading';
import swal from 'sweetalert';
const { Option } = Select;




function ListTodo(props) {
    // console.log(props)
    
    const {name} = useParams()
    
    // const ref = firebase.firestore().collection('todos')
    useEffect(()=>{
        const getTodos = ()=> {
            //GET FUNC
            props.isLoading(true)
            const ref = firebase.firestore().collection('todos')
            ref.orderBy(props.filter).onSnapshot((querySnapshot)=>{
                const items = []
                querySnapshot.forEach((doc)=>{
                    items.push(doc.data())
                })
                props.setListTodo(items.filter(res=> res.name === name))
                props.isLoading(false)

            })
        }
        getTodos()
    },[props.filter, name]) 


    // DELETE FUNC 
    const deleteTodos =(id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this todo list!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willDelete) => {
            if (willDelete) {
                props.isLoading(true)

                const ref = firebase.firestore().collection('todos')
                ref.doc(id).delete()
                .catch(err=> console.log(err))
                props.isLoading(false)
                swal("Poof! Your todo list has been deleted!", {
                    icon: "success",
                    timer : 1500,
                    button: false
                });
            } 
        });
        // console.log(data)
    }

    // DONE FUNC 
    const doneTodos = (data) => {
        props.isLoading(true)
        const ref = firebase.firestore().collection('todos')
        ref.doc(data.id)
        .update({
            ...data,
            isDone : true
        })
        .catch(err=> console.log(err))
        props.isLoading(false)
    }

    // with get func firebase
    // function getTodos() {
    //     ref.get().then(item =>{
    //         const items = item.docs.map(doc=> doc.data())
    //         setData(items.filter(res=> res.name === name))
    //     })
    // }
    
    const handleChangeFilter = (value)=> props.setFilter(value)
    return (
        <div className='card-list'>
            {props.loading ? <Loading /> : null}
           
            <header>
                <h1>Hello : {name}</h1>
                <div className="act-button">
                    <div className="filter">
                        Sort by: &nbsp;
                        <Select defaultValue="title" style={{ width: 200 }} onChange={handleChangeFilter}>
                            <Option value="title">Alphabetical</Option>
                            <Option value="createdAt">CreatedBy Time</Option>
                        </Select>
                    </div>
                    <Link to={`/form/${name}`} onClick={()=>props.setDetailTodo({})}>
                        <Button size='large' >Create a ToDo</Button>
                    </Link>
                </div>
            </header>
            <div className="list">
                <Row gutter={[16, 16]}>
                    {
                        props.listTodo.map((res,i)=>(
                            <Col xs={24} sm={12} md={8} lg={8} xl={6} key={i}>
                                <div className="card">
                                    <div className="chead">
                                        <Link to={`/form/${name}/${res.id}`} >
                                            <Edit2 />
                                        </Link>
                                        <Trash2 className='trash' onClick={()=> deleteTodos(res.id)}/>
                                    </div>
                                    <div className="cbody">
                                        <img src={res.img} alt="todo"/>
                                        <div className="con">
                                            <h3>{res.title}</h3>
                                            <p className="des">
                                                {res.desc}
                                            </p>
                                            {
                                                res.isDone ?
                                                <Button disabled>Done</Button>
                                                :
                                                <Button onClick={()=>doneTodos(res)}>This is done</Button>
                                                
                                            }
                                        </div>
                                    </div>
                                    <div className="cfoot">
                                        <p>CreatedAt:{res.time}</p>
                                        <p>CreatedBy: {res.name}</p>
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
            </div>
            
        </div>
    );
}

const mapStateToProps = (state)=>{
    return{
        loading : state.loading,
        listTodo : state.listTodo,
        filter : state.filter
    }
}


const mapDispatchToProps = (dispatch) =>{
    return {
        isLoading : (data) => { dispatch({type:'LOADING' , data: data})},
        setListTodo : (data) => { dispatch({type:'LIST_TODO' , data: data})},
        setDetailTodo : (data) => { dispatch({type:'DETAIL_TODO' , data: {}})},
        setFilter : (data) => { dispatch({type:'FILTER' , data: data})}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListTodo);