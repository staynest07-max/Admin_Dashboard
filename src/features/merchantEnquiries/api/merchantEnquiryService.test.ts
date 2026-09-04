import { beforeEach,describe,expect,it,vi } from 'vitest';
const {get,patch}=vi.hoisted(()=>({get:vi.fn(),patch:vi.fn()}));
vi.mock('../../../api/client',()=>({apiClient:{get,patch}}));
import { merchantEnquiryService } from './merchantEnquiryService';
describe('merchant enquiry service',()=>{
 beforeEach(()=>vi.clearAllMocks());
 it('lists enquiries',async()=>{get.mockResolvedValue({data:[]});await expect(merchantEnquiryService.list()).resolves.toEqual([]);expect(get).toHaveBeenCalledWith('/merchants/enquiries')});
 it('passes list errors through',async()=>{get.mockRejectedValue(new Error('list'));await expect(merchantEnquiryService.list()).rejects.toThrow('list')});
 it('loads detail',async()=>{get.mockResolvedValue({data:{id:'e'}});await merchantEnquiryService.detail('e');expect(get).toHaveBeenCalledWith('/merchants/enquiries/e')});
 it('passes detail errors through',async()=>{get.mockRejectedValue(new Error('detail'));await expect(merchantEnquiryService.detail('e')).rejects.toThrow('detail')});
 it('updates using only status',async()=>{patch.mockResolvedValue({data:{id:'e'}});await merchantEnquiryService.updateStatus('e','CONTACTED');expect(patch).toHaveBeenCalledWith('/merchants/enquiries/e',{status:'CONTACTED'});expect(patch.mock.calls[0][1]).not.toHaveProperty('merchantId');expect(patch.mock.calls[0][1]).not.toHaveProperty('userId')});
 it('passes update errors through',async()=>{patch.mockRejectedValue(new Error('update'));await expect(merchantEnquiryService.updateStatus('e','REJECTED')).rejects.toThrow('update')});
});
