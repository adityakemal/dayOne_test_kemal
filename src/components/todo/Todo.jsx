import React from 'react';
import { Button, Input, Form } from 'antd';
import {Formik, Field} from 'formik'
import * as Yup from 'yup'

import { connect } from 'react-redux';

function Todo(props) {
    const formSchema = Yup.object({
        name : Yup.string().required()
    })
    const initialValues = {
        name : '',
    }
    return (
        <div className='todo'>
                <Formik 
                    initialValues={initialValues}
                    validationSchema={formSchema}
                    onSubmit={(data)=> {
                        console.log(data)
                        props.history.push(`/form/${data.name}`)
                    }}
                >
                    {
                        ({touched, errors, handleSubmit, values})=>(
                            
                            <Form layout="vertical">

                                <Form.Item 
                                    validateStatus={touched.name && errors.name ? 'error' : 'success'}  
                                    help={touched.name && errors.name}
                                    label='Name' required 
                                >
                                    <Field
                                        as={Input}
                                        name='name'
                                        placeholder='Your name'
                                    />
                                </Form.Item>
                                {/* <Link to={`/add/${values.name}`}> */}
                                    <Button htmlType='submit' size='large' onClick={handleSubmit}>Next</Button>
                                {/* </Link> */}
                            </Form>

                        )
                    }
                </Formik>
                
        </div>
    );
}



export default Todo;