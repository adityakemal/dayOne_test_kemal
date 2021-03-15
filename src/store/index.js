import {createStore} from 'redux'
// 1
const initialState = {
    loading : false,
    detailTodo : {},
    listTodo : [],
    filter : 'title'
}



// 3
const reducer = (state = initialState , action) => {
    // console.log('reducer berjalan', action);

    // disini eksekusi by action type yg di kirim 
    if (action.type === 'LOADING') {
        // console.log(state);
       return {...state, loading : action.data}
    }

    if (action.type === 'DETAIL_TODO') {
        // console.log(state);
       return {...state, detailTodo : action.data}
    }

    if (action.type === 'LIST_TODO') {
        // console.log(state);
       return {...state, listTodo : action.data}
    }

    if (action.type === 'FILTER') {
        // console.log(state);
       return {...state, filter : action.data}
    }
    

    return state
}

// 2
const store = createStore(reducer)


//4
export default store