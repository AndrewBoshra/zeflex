import React from 'react'
import { Star, StarHalf } from '@material-ui/icons/';
import './StarsReview.scss'
function StarsReview(props) {
    return (
        <div className="review-stars">
            {
                [...Array(5).keys()].map((i) => {
                    const review = props.review;
                    if (review >= i + 1)
                        return <Star className="active" />;
                    if (review >= i + .5)
                        return <StarHalf className="active" />;
                    return <Star />;
                }
                )
            }
        </div>)
}

function StarsReviewInput(props) {
    const callback=props.callBack;
    const value=props.value??0;

    return (
        <div className="review-stars">
            {
                [...Array(5).keys()].map((i) => {

                    return <Star className={value >= i + 1? "active":null} onClick={()=>callback(i+1)}/>;
                }
                )
            }
        </div>)
}


export { StarsReview, StarsReviewInput };