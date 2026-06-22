const apis =[
   
    "https://django-production-126c.up.railway.app/api/products",
    "https://django-production-126c.up.railway.app/api/product",
    "https://django-production-126c.up.railway.app/",
    "https://django-production-126c.up.railway.app/api/sliders",
    "https://django-production-126c.up.railway.app/api/category",
    "https://django-production-126c.up.railway.app/api/unstitchs",
    "https://django-production-126c.up.railway.app/api/unstitch"            
    
    
]

export const authApis = {
    register: "https://django-production-126c.up.railway.app/auth/register/",
    token: "https://django-production-126c.up.railway.app/api/token/",    // ← /api/ add kiya
    login: "https://django-production-126c.up.railway.app/api/auth/login/",
    forgotPassword: "https://django-production-126c.up.railway.app/api/forgot-password/",  // ye apke urls.py ke mutabik
    tokenRefresh: "https://django-production-126c.up.railway.app/api/token/refresh/", 
    findUser: "https://django-production-126c.up.railway.app/api/auth/find-user/",  
};
export const cartApis = {
    base: "https://django-production-126c.up.railway.app/api/cart/",
    add: "https://django-production-126c.up.railway.app/api/cart/add/",
    remove: "https://django-production-126c.up.railway.app/api/cart/remove/",
    list: "https://django-production-126c.up.railway.app/api/cart/",
    clear: "https://django-production-126c.up.railway.app/api/cart/clear/",  
};

export const orderApis = {
    create: "https://django-production-126c.up.railway.app/orders/create/",
    myOrders: "https://django-production-126c.up.railway.app/api/orders/my-orders/",
    orderDetails: (orderId) => `https://django-production-126c.up.railway.app/api/orders/${orderId}/`,
    allOrders: "https://django-production-126c.up.railway.app/api/admin/orders/",
    updateStatus: (orderId) => `https://django-production-126c.up.railway.app/api/admin/orders/${orderId}/update-status/`,
};




export default apis