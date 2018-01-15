import { Module } from 'webapp-core';
Module.module('http', function () {
    this.resource = {
        js:['/node_modules/jquery/dist/jquery.js','js/httpService.js']
    };
},'env');