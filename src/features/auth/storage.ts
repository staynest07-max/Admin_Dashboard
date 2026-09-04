const KEY='staynest.dashboard.refresh-session';
export const refreshStorage={get:()=>sessionStorage.getItem(KEY),set:(value:string)=>sessionStorage.setItem(KEY,value),clear:()=>sessionStorage.removeItem(KEY)};
