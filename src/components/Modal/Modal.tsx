import React from 'react'
import { useEffect, useRef, useState } from 'react';
import { createPortal } from "react-dom"
import LoadingSpinner from '../Spinner/Spinner';
import './modal.scss'
interface Props {
    children?: React.ReactNode,
    confirmation?: Confirmation,
    onClose: ()=>any,

}

interface Confirmation {
    confirmButtonText?: string,
    title: string,
    loading?: boolean,
    onConfirm: ()=>any,
    children?: React.ReactNode,
}

const ModalPortal: React.FC<Props> = ({ children, onClose, confirmation}) => {
    const elRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
    const modalRoot = document.getElementById("modal");
    const [confirming, setConfirming] = useState(false)
    if (!elRef.current) {
        elRef.current = document.createElement("div");
    }

    useEffect(() => {
        modalRoot!.appendChild(elRef.current!);
        return () => {
            if(elRef.current){
                modalRoot!.removeChild(elRef.current!)
            }
        }
    }, []);

    const closeDialog = (ev: MouseEvent) => {
        ev.stopPropagation();
        if(confirming) return;
        modalRoot!.removeChild(elRef.current!)
        onClose();
    }

    const closeButton = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        ev.stopPropagation();
        if(confirming) return;
        modalRoot!.removeChild(elRef.current!)
        onClose();
    }

    if(modalRoot){
        modalRoot.onclick = closeDialog
    }

    const preventDefault = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    }

    const runOnConfirm = (callBack: ()=>any): void => {
        if(confirming) return
        setConfirming(true);
        callBack();
        setConfirming(false);
    }

    const ConfirmationModal: React.FC<Confirmation> = ({title, onConfirm, confirmButtonText, children, loading}) => {
        return (
            <div className="default-confirmation-box">
                <div className="modal-title">{title}</div>
                {
                    children? (children): null
                }
                <div className="action-buttons" >
                    <button className={`spinner-container custom-button confirm-button ${confirming || loading? 'loading': ''}`} onClick={e => runOnConfirm(onConfirm)}>
                        <span className={confirming || loading? 'hidden': ''}>{confirmButtonText? confirmButtonText : 'CONFIRM'}</span>
                        {
                            confirming || loading? 
                            (<LoadingSpinner/>) : null
                        }
                    </button>
                    <button className={`custom-button cancel-button ${confirming || loading? 'disabled loading': ''}`} onClick={e => closeButton(e)}>
                    <span>CANCEL</span>
                    </button>
                </div>
            </div>
        )
    }


    return createPortal(
        <div>
            <div onClick={preventDefault}>
                {/* {children} */}
                {
                    // console.log()
                    confirmation? 
                        (<ConfirmationModal children={children} loading={confirmation.loading} title={confirmation.title} onConfirm={confirmation.onConfirm} confirmButtonText={confirmation.confirmButtonText}/>): children
                }
            </div>
        </div>,
        elRef.current
    )
}


export default ModalPortal;

