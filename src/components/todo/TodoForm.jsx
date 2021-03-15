import React, { useEffect} from 'react';
import { Button, Col, Input, Form } from 'antd';
import {Formik, Field} from 'formik'
import * as Yup from 'yup'
import { v4 as uuidv4} from 'uuid'
import firebase from "../../firebase";

import moment from 'moment'
import { useParams } from "react-router-dom";


import { Link } from 'react-router-dom';
import Loading from '../shared/Loading';
import swal from 'sweetalert';

import { connect } from 'react-redux';


function TodoForm(props) {
    // params 
    const {name, id} = useParams()

    

    //FUNCT ADD
    function addTodos(data) {
        const ref = firebase.firestore().collection('todos')
        ref.doc(data.id)
        .set(data)
        .catch(err=> console.log(err))
        props.isLoading(false)
        swal({
            title: "Saved",
            icon: "success",
            buttons: false,
            timer : 1500
        })
    }

    //FUNCT EDIT
    function editTodos(data) {
        const ref = firebase.firestore().collection('todos')
        ref.doc(data.id)
        .update(data)
        .catch(err=> console.log(err))
        props.isLoading(false)
        props.history.push(`/list/${name}`)
        swal({
            title: "Edited",
            icon: "success",
            buttons: false,
            timer : 1500
        })
    }
    
    useEffect(()=>{
        let isEdit = id !== undefined
        if (isEdit) {
            const getDataEdit =()=>{
                props.isLoading(true)
                const ref = firebase.firestore().collection('todos')
                ref.where("id", "==", id).onSnapshot((querySnapshot)=>{
                    querySnapshot.forEach((doc)=>{
                        props.setDetailTodo(doc.data())
                    })
                    props.isLoading(false)
                })
            }
            getDataEdit()
        }
    }, [])

    const fieldInputTodo = [
        {name : 'title', label: 'Header', type: 'text'},
        {name : 'desc', label: 'Description', type: 'text'},
        {name : 'img', label: 'File', type: 'file'},
    ]
    
    const formSchema = Yup.object({
        title : Yup.string().required('Header is required field'),
        desc : Yup.string().required('Description is required field'),
        img : Yup.string().required('File is required field')
    })


    let initialValues={
        "id" : props.detailTodo.id || uuidv4(),
        "createdAt" : props.detailTodo.createdAt || new Date(),
        "name" : name,
        "title" : props.detailTodo.title || "",
        "desc" :  props.detailTodo.desc || "",
        "isDone" : props.detailTodo.isDone || false,
        "img" : props.detailTodo.img || "",
        "fileName" : props.detailTodo.fileName || "",
        "time" : props.detailTodo.time || `${moment(new Date()).format('DD MMMM')} ${moment(new Date()).format('hh:mm A')}`
    }



    const handleImageUpload = (e, setFieldValue)=>{
        const file = e.target.files[0]
        const storageRef = firebase.storage()
        const fileRef = storageRef.ref(file.name)
        fileRef.put(file).then(()=> {
            console.log('uploaded file')
            fileRef.getDownloadURL().then(res=>{
                // console.log(res)
                setFieldValue('img', res) //call hook and upload
                setFieldValue('fileName', e.target.files[0].name) //call hook and upload
            })
        })
        // console.log(e.target.files[0].name)
    }
    return (
        <div className='todo-form'>
            {props.loading ? <Loading /> : null}
            <header>
                <h1>Hello : {name}</h1>
                <div className="act-button">
                    <Link to={`/list/${name}`}>
                        <Button size='large' >Show ToDo list</Button>
                    </Link>
                </div>
            </header>
            <Formik 
                initialValues={ initialValues }
                enableReinitialize
                validationSchema={formSchema}
                onSubmit={(val, {resetForm})=> {
                    if (id === undefined) {
                        // console.log(data)
                        // setLoading(true)
                        props.isLoading(true)
                        addTodos(val)
                        resetForm({values : ''})
                    } else {
                        // setLoading(true)
                        props.isLoading(true)
                        editTodos(val)
                        // console.log(body)
                        resetForm({values : ''})
                    } 
                }}
            >
                {
                    ({touched, errors, handleSubmit, values, setFieldValue})=>(
                        <Col xs={24} md={24} className='box'>
                            <Form
                                layout="vertical"
                                >
                                    {
                                        fieldInputTodo.map((res,i)=>(
                                            <Form.Item 
                                                key={i}
                                                validateStatus={touched[`${res.name}`] && errors[`${res.name}`] ? 'error' : 'success'}  
                                                help={touched[`${res.name}`] && errors[`${res.name}`]}
                                                label={res.label} required 
                                            >
                                                {
                                                    res.type === 'file' ?
                                                    <div className='custom_input_files'>
                                                        <p>{values.fileName}</p> <label htmlFor={res.name}>Upload</label>
                                                        <input accept="image/*" id={res.name} 
                                                        className='hide_input_file' 
                                                        name={res.name}
                                                        onClick={(event)=>  event.target.value = null}
                                                        type={res.type}
                                                        onChange={(e)=>handleImageUpload(e, setFieldValue)}
                                                        />
                                                    </div>
                                                    :
                                                    <Field
                                                        as={Input}
                                                        name={res.name}
                                                        // placeholder='Your file'
                                                        type={res.type}
                                                    />
                                                }

                                            </Form.Item>
                                        ))
                                    }
                                {/* <pre>
                                    {JSON.stringify(values, null, 2)}
                                </pre>
                                <pre>
                                    errors : 
                                    {JSON.stringify(errors, null, 2)}
                                </pre> */}

                                <Form.Item>
                                    <Button onClick={handleSubmit} size='large' type="primary">Submit</Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    )
                }
            </Formik>
        </div>
    );
}


const mapStateToProps = (state)=>{
    return{
        loading : state.loading,
        detailTodo : state.detailTodo
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        isLoading : (data) => { dispatch({type:'LOADING' , data: data})},
        setDetailTodo : (data) => { dispatch({type:'DETAIL_TODO' , data: data})}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoForm);
