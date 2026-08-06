const apis =[
   
    "https://web-production-10987.up.railway.app/api/products",
    "https://web-production-10987.up.railway.app/api/product",
    "https://web-production-10987.up.railway.app/",
    "https://web-production-10987.up.railway.app/api/sliders",
    "https://web-production-10987.up.railway.app/api/category",
    "https://web-production-10987.up.railway.app/api/unstitchs",
    "https://web-production-10987.up.railway.app/api/unstitch"            
    
    
]

export const authApis = {
    register: "https://web-production-10987.up.railway.app/auth/register/",
    token: "https://web-production-10987.up.railway.app/api/token/",    // ← /api/ add kiya
    login: "https://web-production-10987.up.railway.app/api/auth/login/",
    forgotPassword: "https://web-production-10987.up.railway.app/api/forgot-password/",  // ye apke urls.py ke mutabik
    tokenRefresh: "https://web-production-10987.up.railway.app/api/token/refresh/", 
    findUser: "https://web-production-10987.up.railway.app/api/auth/find-user/",  
};
export const cartApis = {
    base: "https://web-production-10987.up.railway.app/api/cart/",
    add: "https://web-production-10987.up.railway.app/api/cart/add/",
    remove: "https://web-production-10987.up.railway.app/api/cart/remove/",
    list: "https://web-production-10987.up.railway.app/api/cart/",
    clear: "https://web-production-10987.up.railway.app/api/cart/clear/",  
};

export const orderApis = {
    create: "https://web-production-10987.up.railway.app/orders/create/",
    myOrders: "https://web-production-10987.up.railway.app/api/orders/my-orders/",
    orderDetails: (orderId) => `https://web-production-10987.up.railway.app/api/orders/${orderId}/`,
    allOrders: "https://web-production-10987.up.railway.app/api/admin/orders/",
    updateStatus: (orderId) => `https://web-production-10987.up.railway.app/api/admin/orders/${orderId}/update-status/`,
};




export default apis