import React from 'react';
import { useState } from 'react'
import './personTile.scss';
import {Person} from '../../types/Person'
import {Request} from '../../types/Request'
import userAvatar from '../../assets/avatar.png'
import ModalPortal from '../Modal/Modal';
import LoadingSpinner from '../../components/Spinner/Spinner';
import axios from '../../modules/axios/axios_wrapper'
// import DateTimePicker from 'react-datetime-picker';
// const DateTimePicker = require("react-datetime-picker")
import DateTimePicker from 'react-datetime-picker'
import Moment from 'react-moment'

interface Props{
    person: Person,
    incoming?: Request,
    outgoing?: Request
}



const PersonTile: React.FC<Props> = ({person, incoming, outgoing}) =>{
    var [deleteModal, setDeleteModal] = useState(false)
    var [editModal, setEditModal] = useState(false)
    var [createModal, setCreateModal] = useState(false)
    var [incoming, setIncoming] = useState<Request | undefined>(incoming)
    var [outgoing, setOutgoing] = useState<Request | undefined>(outgoing)
    var [isAccepting, setIsAccepting] = useState(false)
    var [isDeclining, setIsDeclining] = useState(false)
    var [modalLoading, setModalLoading] = useState(false)
    var [modalError, setModalError] = useState("")
    var [requestTime, setRequestTime] = useState(new Date())
    const StatusButton: React.FC<{status?: string}> = ({status}) => {
        return (
            <div className="action-buttons" >
            {
                status == "PENDING"? (
                    <div>
                        <button onClick={e => setEditModal(!editModal)} className="btn fab-btn"><i className="fa fa-pencil" aria-hidden="true"></i></button>
                        <button onClick={e => setDeleteModal(!deleteModal)} className="btn fab-btn"><i className="fa fa-times warning"></i></button>
                    </div>
                ): null
            }
            <button className="accept-button disabled" >
                {status}
            </button>
            </div>
        )
    }

    const setForm = (date: Date):void => {
        if(date){
            setModalError("")
            setRequestTime(date)
        }
    }

    const acceptRequest = (request: Request):void => {
        setIsAccepting(true);
        axios.post(`/requests/${request.id}/approve`)
        .then(response => {
            request.status = "ACCEPTED"
            setIsAccepting(false)
        })
    }


    const declineRequest = (request: Request):void => {
        setIsDeclining(true);
        axios.post(`/requests/${request.id}/reject`)
        .then(response => {
            request.status = "REJECTED"
            setIsDeclining(false)
        })
    }

    const deleteRequest = ():void => {
        setModalLoading(true)
        axios.delete(`/requests/${incoming?.id}`)
        .then(response => {
            setModalLoading(false)
            setIncoming(undefined)
            setDeleteModal(false)
        })
    }

    const createRequest = ():void => {
        if(!requestTime){
            setModalError("You'll need to pick a date and time");
            return;
        }
        console.log(person)
        var request: Request = {
            toUser: person.id,
            time: requestTime,
            status: "PENDING"
        }
        setModalLoading(true)
        axios.post(`/requests/`, request)
        .then(response => {
            setIncoming(request);
            setModalLoading(false)
            setCreateModal(false);
            setRequestTime(new Date())
        })
    }

    const editRequest = ():void=> {
        if(!requestTime){
            setModalError("You'll need to pick a date and time");
            return;
        }
        setModalLoading(true)
        var request: Request = {
            time: requestTime
        }
        axios.patch(`/requests/${incoming?.id}`, request)
        .then(response => {
            setModalLoading(false)
            incoming!.time = requestTime
            setIncoming(incoming);
            setEditModal(false)
        })
    }

    console.log(person.firstName, incoming, outgoing)
    return (
        <div className='person-tile'>
            <div className='top'>
                <div className="image-container">
                    <img src={userAvatar} alt='User Avatar' />
                </div>
                <div>
                    <p className='person-name'>{`${person.firstName} ${person.lastName}`}</p>
                    <p className='caption'>{person.organization || "Tefer"}</p>
                    {
                        incoming || outgoing? 
                            (
                                <span className="meet-time">
                                    Meet Time: <Moment fromNow>{incoming?.time || outgoing?.time }</Moment>
                                    
                                </span>
                            )
                        : <span>&nbsp;</span>
                    }
                </div>
            </div>
            <div className="info">
                <div className='action-buttons'>

                </div>
                {
                    outgoing && outgoing.status == "PENDING" ? (
                        <div className="action-buttons" >
                            <button className={`accept-button spinner-container custom-button ${isAccepting? 'loading': ''}`} onClick={e => acceptRequest(outgoing!)}>
                                <span className={isAccepting? 'hidden': ''}>ACCEPT</span>
                                {
                                    isAccepting? 
                                    (<LoadingSpinner/>) : null
                                }
                            </button>
                            <button className={`reject-button spinner-container custom-button ${isDeclining? 'loading': ''}`} onClick={e => declineRequest(outgoing!)}>
                            <span className={isDeclining? 'hidden': ''}>DECLINE</span>
                                {
                                    isDeclining? 
                                    (<LoadingSpinner/>) : null
                                }
                            </button>
                        </div>
                    ): null
                }
                {
                    incoming || ((outgoing?.status ?? "PENDING") != "PENDING")? <StatusButton status={incoming?.status || outgoing?.status}/>: null
                }
                {
                    !incoming && !outgoing ? (
                        <div className="action-buttons custom-button" >
                            <button className="accept-button custom-button" onClick={e => setCreateModal(true)}>
                                SEND REQUEST
                            </button>
                        </div>
                    ): null
                }
                
            </div>

            {
                deleteModal? (
                    <ModalPortal onClose={ () => {setDeleteModal(!deleteModal)}} confirmation={{title: "Are you sure you want to withdraw the request?", onConfirm: ()=>deleteRequest(), loading: modalLoading}}>
                        {/* <input type="date" onChange={e => setRequestTime(e.target.value))}/> */}
                    </ModalPortal>
                ): null
            }

            {
                editModal? (
                    <ModalPortal onClose={ () => {setEditModal(!setEditModal)}} confirmation={{title: "To What time would you like to change your meet to", onConfirm: editRequest, confirmButtonText:'SAVE', loading: modalLoading}}>
                        <div className='create-form'>
                            <DateTimePicker onChange={setForm} value={requestTime} />
                            <div className="error">
                                <p>{modalError? '*'+modalError: null}</p>
                            </div>
                        </div>
                    </ModalPortal>
                ): null
            }

            {
                createModal? (
                    <ModalPortal onClose={ () => {setCreateModal(!createModal)}} confirmation={{title: "Please select the time that you want to meet up on", onConfirm: createRequest, confirmButtonText:'REQUEST', loading: modalLoading}}>
                        <div className='create-form'>
                            <div className="time-selector">
                                <DateTimePicker onChange={setForm} value={requestTime} />
                            </div>
                            <div className="error">
                                <p>{modalError? '*'+modalError: null}</p>
                            </div>
                        </div>
                    </ModalPortal>
                ): null
            }
        </div>
    )
}

export default PersonTile;