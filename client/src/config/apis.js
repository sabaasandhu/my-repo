const apis =[
   
    "http://localhost:8000/api/products",
    "http://localhost:8000/api/product",
    "http://localhost:8000/",
    "http://localhost:8000/api/sliders",
    "http://localhost:8000/api/category",
    "http://localhost:8000/api/unstitchs",
    "http://localhost:8000/api/unstitch"            
    
    
]

export const authApis = {
    register: "http://localhost:8000/api/auth/register/",
    token: "http://localhost:8000/api/token/",    // ← /api/ add kiya
    login: "http://localhost:8000/api/auth/login/",
    forgotPassword: "http://localhost:8000/api/forgot-password/",  // ye apke urls.py ke mutabik
    tokenRefresh: "http://localhost:8000/api/token/refresh/", 
    findUser: "http://localhost:8000/api/auth/find-user/",  
};
export const cartApis = {
    base: "http://localhost:8000/api/cart/",
    add: "http://localhost:8000/api/cart/add/",
    remove: "http://localhost:8000/api/cart/remove/",
    list: "http://localhost:8000/api/cart/",
    clear: "http://localhost:8000/api/cart/clear/",  
};

export const orderApis = {
    create: "http://localhost:8000/api/orders/create/",
    myOrders: "http://localhost:8000/api/orders/my-orders/",
    orderDetails: (orderId) => `http://localhost:8000/api/orders/${orderId}/`,
    allOrders: "http://localhost:8000/api/admin/orders/",
    updateStatus: (orderId) => `http://localhost:8000/api/admin/orders/${orderId}/update-status/`,
};




export default apis