# node-red-node-loader-example
Example for [node-red-node-loader](https://www.npmjs.com/package/node-red-node-loader) and [node-red-test-helper-tool](https://www.npmjs.com/package/node-red-test-helper-tool)

# Run test example
```javascript
$ npm run test
```

# Example
```javascript
import {NodeLoader} from 'node-red-node-loader'
import helper from 'node-red-node-test-helper'
import lowerNode from './nodes/lower-case'
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
            // const nodeArr = new NodeLoader().getNodeArray(res)
            const nodeArr = new NodeLoader().getNodeArrayFromFlow(flow)
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
    it("test node loader with node-red-node-loader, node-red-test-helper-tool and using async. testFlow",async()=>{
        const testServer = new NodeRedTestServer(helper)
        await fs.readFile(FILENAME,'utf-8').then(async(res)=>{
            const flow = JSON.parse(res)
            const nodeArr = new NodeLoader().getNodeArray(res)
             
            const testOuput = await testServer.testFlow(nodeArr,flow,'n0','n1',{payload:"UpperCase"})

        })
    })
    it("test node loader with node-red-node-loader, node-red-test-helper-tool and using async. healthCheck",async()=>{
        const testServer = new NodeRedTestServer(helper)
        await fs.readFile(FILENAME,'utf-8').then(async(res)=>{
            const flow = JSON.parse(res)
            const nodeArr = new NodeLoader().getNodeArray(res)
             
            const health = await testServer.healthCheck(nodeArr,flow,'n0')

        })
    })
    it("test node loader with node-red-node-loader, node-red-test-helper-tool and using async. testFlowReceive",async()=>{
        const flow = [{id:'n0',type:'lower-case',wire:[['n1']]},{id:'n1',type:'debug',wire:[[]]}]
        const testServer = new NodeRedTestServer(helper)
        const nodeArr = new NodeLoader().getNodeArrayFromFlow(flow)
            
        const testOuput = await testServer.testFlowReceive([...nodeArr,lowerNode],flow,'n0','n0',{payload:"UpperCase"})
    })
} )
```