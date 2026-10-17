import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildEnquiryPayload,sendEnquiry} from '../src/lib/enquiry.ts';
const endpoint='https://api.onbooking.ca/v1/submissions/62656a87-eac7-4a49-b6fc-8f41630c7fd6';
const values={name:' Preview Test ',email:'qa@example.invalid',tel:'5550100',message:' Synthetic test. '};
const payload=buildEnquiryPayload(values,'https://aladdindonair.com/?private=value#contact',5000);

test('payload uses the verified fields contract without query data',()=>{
 assert.equal(payload.pageUrl,'https://aladdindonair.com/');
 assert.deepEqual(payload.fields.map(f=>f.id),['full_name','email','phone','message']);
 assert.equal(payload.fields[0].value,'Preview Test');
 assert.equal(payload.timeOnPageMs,5000);
 assert.throws(()=>buildEnquiryPayload({...values,name:'  '},'https://aladdindonair.com/',20),/complete all four/);
});
test('accepted response sends JSON with an idempotency key',async()=>{
 let sent;
 await sendEnquiry(endpoint,payload,'stable-request-key',async(url,options)=>{
  sent={url,options};return new Response(JSON.stringify({success:true}),{status:201});
 });
 assert.equal(sent.url,endpoint);
 assert.equal(sent.options.method,'POST');
 assert.equal(sent.options.headers['Idempotency-Key'],'stable-request-key');
 assert.deepEqual(JSON.parse(sent.options.body),payload);
});
test('API rejection, rate limit and false success are not treated as receipt',async()=>{
 for(const [status,body,expected] of [[500,{},/could not be sent/],[429,{},/wait a few minutes/],[200,{success:false},/could not be sent/]]){
  await assert.rejects(sendEnquiry(endpoint,payload,'retry-key',async()=>new Response(JSON.stringify(body),{status})),expected);
 }
});
test('network failure propagates and retry can reuse the same request key',async()=>{
 const keys=[];
 const transport=async(_url,options)=>{keys.push(options.headers['Idempotency-Key']);if(keys.length===1)throw new TypeError('Network unavailable');return new Response(null,{status:204});};
 await assert.rejects(sendEnquiry(endpoint,payload,'same-key',transport),/Network unavailable/);
 await sendEnquiry(endpoint,payload,'same-key',transport);
 assert.deepEqual(keys,['same-key','same-key']);
});
