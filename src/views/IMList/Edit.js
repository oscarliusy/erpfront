import React, { Component } from 'react'
import {
    Card,
    Button,
    Form,
    Input,
    Spin,
    message
} from 'antd'

import {postMaterialEdit,getMaterialDetailById} from '../../requests'

export default class Edit extends Component {
    constructor(){
        super()
        this.state={
            id:0,
            uniqueId:'',
            amount:0,
            cost:0,
            purchaser:'',
            image:'',
            desc:'',
            isLoading:false
        }
    }

    initData = () =>{
        this.setState({isLoading:true})
        getMaterialDetailById(this.props.location.pathname.split('/').pop())
        .then(resp=>{
            if(!this.updater.isMounted(this)) return
            this.setState({
                ...this.state,
                ...resp
            })
        })
        .catch(err=>{
            console.log(err)
        })
        .finally(()=>{
            this.setState({isLoading:false})
        })
    }

    postData = () =>{
        const params = {
            id:this.state.id,
            uniqueId:this.state.uniqueId,
            amount:this.state.amount,
            cost:this.state.cost,
            purchaser:this.state.purchaser,
            image:this.state.image,
            desc:this.state.desc
        }
        this.setState({isLoading:true})
        postMaterialEdit(params)
            .then(resp=>{
                console.log(resp)
                message.success(resp.msg)
            })
            .catch(err=>{
                console.log(err)
            })
            .finally(()=>{
                this.setState({isLoading:false})
            })
    }

    componentDidMount(){
        this.initData()  
    }

    render() {
        return (
            <div onClick={this.postData}>
                编辑
            </div>
        )
    }
}
