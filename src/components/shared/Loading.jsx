import React from 'react';
import {BeatLoader} from "react-spinners"
function Loading() {
    return (
        <div className='loading'>
            <div className="spinner">
                <BeatLoader color='#ffff'/>
            </div>
        </div>
    );
}

export default Loading;