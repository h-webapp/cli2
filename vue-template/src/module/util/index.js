import { Module } from 'webapp-core';
Module.module('util', function () {
    this.resource = {
        js:['/node_modules/lz-string/libs/lz-string.js','js/clone.js','js/storage.js','js/string-util.js']
    };
});