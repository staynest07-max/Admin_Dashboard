import { describe,expect,it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { MerchantEnquiry } from '../../contracts/merchantEnquiry';
import { EnquiryState } from '../../components/merchant/EnquiriesView';
import { merchantEnquiryKeys } from './hooks/useMerchantEnquiries';
import { displayEnquiryStatus,toEnquiryItem } from './mapper';
import { allowedEnquiryTransitions } from './transitions';
const enquiry:MerchantEnquiry={id:'e1',publicId:'ENQ-1',pg:{publicId:'PG-1',name:'Nest',location:{address:'A',city:'B',locality:'C'}},user:{name:'Asha',phone:'9000000000',email:null},details:{message:null,roomType:null,moveInDate:null},status:'NEW',createdAt:'2026-01-01T00:00:00Z',updatedAt:'2026-01-01T00:00:00Z'};
describe('merchant enquiry presentation',()=>{
 it('maps backend DTO without inventing optional values',()=>expect(toEnquiryItem(enquiry)).toMatchObject({tenantName:'Asha',tenantEmail:undefined,roomType:'Not specified',notes:undefined,status:'NEW'}));
 it('presents canonical statuses',()=>expect(displayEnquiryStatus('VISIT_SCHEDULED')).toBe('VISIT SCHEDULED'));
 it('allows only canonical transitions',()=>{expect(allowedEnquiryTransitions('NEW')).toEqual(['CONTACTED','REJECTED','CANCELLED']);expect(allowedEnquiryTransitions('CLOSED')).toEqual([])});
 it('uses stable list and detail query keys',()=>{expect(merchantEnquiryKeys.all).toEqual(['merchant-enquiries']);expect(merchantEnquiryKeys.detail('e1')).toEqual(['merchant-enquiries','detail','e1'])});
 it('renders empty/error state and retry control',()=>{const html=renderToStaticMarkup(createElement(EnquiryState,{title:'No enquiries found',text:'Nothing here',retry:()=>undefined}));expect(html).toContain('No enquiries found');expect(html).toContain('Retry')});
});
