import {NodeLoader} from 'node-red-node-loader'
import helper from 'node-red-node-test-helper'

import fs from 'fs/promises'
helper.init(require.resolve('node-red'))

describe("test node red flow",()=>{
    const FILENAME = __dirname+"/flows/flow.json"
    // const nodeLoader = new NodeLoader()
    beforeAll((done)=>{
        helper.startServer(done)
    })
    afterAll((done)=>{
        helper.stopServer(done)
    })
    afterEach(()=>{
        // helper.unload()
    })
    it("test node loader",(done)=>{
        fs.readFile(FILENAME,'utf-8').then((res)=>{
            console.log(res)
            const flow = JSON.parse(res)
            const nodeArr = new NodeLoader().getNodeArray(res,['catch'])
            console.log(nodeArr)
            
            helper.load(nodeArr,flow,()=>{
                const n0 = helper.getNode("test-input")
                console.log(n0)
                done()
            })
            // done()
        })
    })
} )