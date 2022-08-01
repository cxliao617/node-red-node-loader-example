import {NodeLoader} from 'node-red-node-loader'
import helper from 'node-red-node-test-helper'
import {NodeRedTestServer} from 'node-red-test-helper-tool'
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
        helper.unload()
    })
    it("test node loader with node-red-node-loader and using done",(done)=>{
        fs.readFile(FILENAME,'utf-8').then(async(res)=>{
            const flow = JSON.parse(res)
            const nodeArr = new NodeLoader().getNodeArray(res)
            
            helper.load([...nodeArr],flow,()=>{
                const n0 = helper.getNode("n0")
                const n1 = helper.getNode("n1")
                n0.send({payload:"UpperCase"})
                n1.on('input',(msg)=>{
                    try{
                        done()
                    }
                    catch(err)
                    {
                        done(err)
                    }
                })
            })
        })
    })
    it("test node loader with node-red-node-loader and using async",async()=>{
        await fs.readFile(FILENAME,'utf-8').then(async(res)=>{
            const flow = JSON.parse(res)
            const nodeArr = new NodeLoader().getNodeArray(res)
            
            await helper.load([...nodeArr],flow)
            const n0 = helper.getNode("n0")
            const n1 = helper.getNode("n1")
            await new Promise((resolve,reject)=>{
                n0.send({payload:"UpperCase"})
                n1.on('input',(msg)=>{
                    try{
                        resolve(msg)
                    }
                    catch(err)
                    {
                        reject(err)
                    }
                })
            })
        })
    })
    it("test node loader with node-red-node-loader, node-red-test-helper-tool and using async",async()=>{
        const testServer = new NodeRedTestServer(helper)
        await fs.readFile(FILENAME,'utf-8').then(async(res)=>{
            const flow = JSON.parse(res)
            const nodeArr = new NodeLoader().getNodeArray(res)
             
            const testOuput = await testServer.testFlow(nodeArr,flow,'n0','n1',{payload:"UpperCase"})

        })
    })
} )