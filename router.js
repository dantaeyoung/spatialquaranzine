const Matrix = httpVueLoader('components/matrix.vue')
const Student = httpVueLoader('components/student-details.vue')
const Work = httpVueLoader('components/work-details.vue')

 // 3. Create the router instance and pass the `routes` option
 export const router = new VueRouter({
    routes: [{
        name: 'matrix',
        path: '/',
        component: Matrix,
    },
    {
        name: 'student',
        path: '/student/:id/:studentName',
        component: Student,
    },
    {
        name: 'work',
        path: '/work/:id',
        component: Work,
    }]
})

