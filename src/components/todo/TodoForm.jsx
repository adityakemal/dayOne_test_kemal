import React, {useState, useEffect} from 'react';
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


function TodoForm(props) {
    // params 
    const {name, id} = useParams()

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({})


    // const ref = firebase.firestore().collection('todos')
    

    //FUNCT ADD
    function addTodos(data) {
        const ref = firebase.firestore().collection('todos')
        ref.doc(data.id)
        .set(data)
        .catch(err=> console.log(err))
        setLoading(false)
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
        setLoading(false)
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
                setLoading(true)
                const ref = firebase.firestore().collection('todos')
                ref.where("id", "==", id).onSnapshot((querySnapshot)=>{
                    querySnapshot.forEach((doc)=>{
                        // items.push(doc.data())
                        setData(doc.data())
                    })
                    setLoading(false)
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
        "id" : data.id || uuidv4(),
        "createdAt" : data.createdAt || new Date(),
        "name" : name,
        "title" : data.title || "",
        "desc" :  data.desc || "",
        "isDone" : data.isDone || false,
        "img" : data.img || "",
        "fileName" : data.fileName || "",
        "time" : data.time || `${moment(new Date()).format('DD MMMM')} ${moment(new Date()).format('hh:mm A')}`
    }



    const handleImageUpload = (e, setFieldValue)=>{
        // setLoading(true)
        const file = e.target.files[0]
        const storageRef = firebase.storage()
        const fileRef = storageRef.ref(file.name)
        // .child(file.name)
        fileRef.put(file).then(()=> {
            console.log('uploaded file')
            fileRef.getDownloadURL().then(res=>{
                // console.log(res)
                setFieldValue('img', res) //call hook and upload
                setFieldValue('fileName', e.target.files[0].name) //call hook and upload
            })
        })
        // setLoading(false)
        // console.log(e.target.files[0].name)
    }
    return (
        <div className='todo-form'>
            {loading ? <Loading /> : null}
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
                        setLoading(true)
                        addTodos(val)
                        resetForm({values : ''})
                    } else {
                        setLoading(true)
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

export default TodoForm;