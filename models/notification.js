const express = require('express');
const {Schema , model} = require('mongoose');

const NotifySchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "user",
    },
    notification : {
        type : Array,
        default: [],
    }
},{timestamps : true});

const NotifyModel = new model('notification' , NotifySchema);

module.exports = NotifyModel;