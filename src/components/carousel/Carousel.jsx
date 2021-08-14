import {  useRef } from 'react'
import './Carousel.scss'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
export default function Carousel(props) {

    const width = 300;
    const list = useRef('');

    const move = (dir) => {
        let listDims = list.current.getBoundingClientRect();
        let parentDims = list.current.parentNode.getBoundingClientRect();
        if (dir === 'right') {
            if (listDims.x + listDims.width <= parentDims.x + parentDims.width) { //can't move 
                list.current.style.transform = 'translateX(0px)';
            }
            else {
                list.current.style.transform = 'translateX(' + (listDims.x - width) + 'px)';
            }
        }
        else if (dir === 'left') {
            if (listDims.x >= parentDims.x) {
                list.current.style.transform = 'translateX(' + (parentDims.width - listDims.width) + 'px)';
            } else {
                let dist=listDims.x + width;
                list.current.style.transform = 'translateX(' +dist+ 'px)';
            }
        }
    }
    return (
        <div {...props}>
            <div className="carousel">
                <KeyboardArrowLeft className="icon left" onClick={() => move('left')} />
                <KeyboardArrowRight className="icon right" onClick={() => move('right')} />
                <div className="carousel-wrapper" ref={list}>
                    {props.children?.map((child) =>
                        <div className="carousel-card selected">
                            {child}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
