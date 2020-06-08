import Vue from "vue";
import VueRouter from "vue-router";

if (process.env.NODE_ENV === "development") {
    Vue.use(VueRouter);
}

import { ROUTER_MODE } from "../config/app";

import Home from "../views/home/index.vue";
import mainInfo from "../views/home/message.vue"
// 考勤管理
import CheckworkMy from "../views/checkwork/My.vue";
import CheckworkAll from "../views/checkwork/All.vue";
import CheckworkCount from "../views/checkwork/Count.vue";
import CheckworkHours from "../views/checkwork/Hours.vue";
import CheckworkChart from "../views/checkwork/Chart.vue";
import HolidayIndex from "../views/checkwork/holiday/Index.vue";
import VacationIndex from "../views/checkwork/vacation/Index.vue";

// 项目管理
import Item from "../views/project/Item.vue";
import ItemAdmin from "../views/project/ItemAdmin.vue";
import ItemPart from "../views/project/ItemPart.vue";
import ItemApprover from "../views/project/ItemApprover.vue";
import ItemForm from "../views/project/ItemForm.vue";
import ItemInfo from "../views/project/ItemInfo.vue";
import Total from "../views/project/Total.vue";

// 审批管理
import ClockList from "../views/apply/clock/List.vue";
import ClockForm from "../views/apply/clock/Form.vue";
import clockApprover from "../views/apply/clock/Approver.vue";
import ClockInfo from "../views/apply/clock/Info.vue"

import BusinesstripList from "../views/apply/businesstrip/List.vue";
import BusinesstripForm from "../views/apply/businesstrip/Form.vue";
import BusinesstripApprover from "../views/apply/businesstrip/Approver.vue"
import BusinesstripInfo from "../views/apply/businesstrip/Info.vue"

import GooutList from "../views/apply/goout/List.vue";
import GooutApprover from "../views/apply/goout/Approver.vue";
import GooutForm from "../views/apply/goout/Form.vue";
import GooutInfo from "../views/apply/goout/Info.vue";
import GooutLook from "../views/apply/goout/Look.vue"

import LeaveList from "../views/apply/leave/List.vue";
import LeaveForm from "../views/apply/leave/Form.vue";
import LeaveApprover from "../views/apply/leave/Approver.vue"
import LeaveInfo from "../views/apply/leave/Info.vue"

import ReceiptList from "../views/apply/receipt/List.vue";
import ReceiptApprover from "../views/apply/receipt/Approver.vue";
import ReceiptForm from "../views/apply/receipt/Form.vue";
import ReceiptLook from "../views/apply/receipt/Look.vue"
import ReceiptInfo from "../views/apply/receipt/Info.vue"

import InvoiceList from "../views/apply/invoice/List.vue";
import InvoiceApprover from "../views/apply/invoice/Approver.vue";
import InvoiceForm from "../views/apply/invoice/Form.vue";
import InvoiceLook from "../views/apply/invoice/Look.vue";
import InvoiceInfo from "../views/apply/invoice/Info.vue"

import ExpenseList from "../views/apply/expense/List.vue";
import ExpenseApprover from "../views/apply/expense/Approver.vue";
import ExpenseForm from "../views/apply/expense/Form.vue";
import ExpenseInfo from "../views/apply/expense/Info.vue"

import TaskList from "../views/apply/task/List.vue";
import TaskForm from "../views/apply/task/Form.vue";

// CRM
import FirstPartyList from "../views/customer/firstparty/List.vue";
import SupplierList from "../views/customer/supplier/List.vue";


// 财务管理
// import Company from "../views/money/Company.vue";
// import Gathers from "../views/money/Gathers.vue";
// import moneyHome from "../views/money/Home.vue";
// import Project from "../views/money/Project.vue";
// 标准文档
import StandardApply from "../views/standard/apply/List.vue";
//import Mine from "../views/documents/Mine.vue";

// 人员管理
import User from "../views/admin/User.vue";
import Department from "../views/admin/Department.vue";
import Company from "../views/admin/Company.vue";
import Notice from "../views/admin/Notice.vue";
import Performance from "../views/admin/Performance.vue";

// 其他管理
import Menu from "../views/other/Menu.vue";
import Role from "../views/other/Role.vue";
import Quartz from "../views/other/Quartz.vue";
import Log from "../views/other/Log.vue";


// Vue.use(VueRouter);

const login = r =>
    require.ensure([], () => r(require("../views/login/index.vue")), "home");
const main = r =>
    require.ensure([], () => r(require("../views/home/main.vue")), "home");

// 注意 权限字段 authRule （严格区分大小写）
export const constantRouterMap = [
    {
        path: "/login",
        component: login,
        name: "登录",
        hidden: true
    },
    {
        path: "/",
        component: Home,
        redirect: "/readme",
        name: "首页",
        hidden: true
    },
    {
        path: "/readme",
        component: Home,
        redirect: "/readme/main",
        icon: "shouye",
        name: "我的主页",
        noDropdown: true,
        children: [
            {
                path: "main",
                component: main
            }
        ]
    },
    {
        path: "/readme1",
        component: mainInfo,
        redirect: "/readme/info",
        name: "消息提醒"
    }
];

export default new VueRouter({
    // mode: 'history', //后端支持可开
    mode: ROUTER_MODE,
    routes: constantRouterMap,
    strict: process.env.NODE_ENV !== "production"
});

export const asyncRouterMap = [
    {
        path: "/checkwork",
        redirect: "/checkwork/my",
        component: Home,
        icon: "guanliyuan1",
        name: "考勤管理",
        children: [
            {
                path: "my",
                component: CheckworkMy,
                name: "我的考勤",
            },
            {
                path: "all",
                component: CheckworkAll,
                name: "全部考勤",
            },
            {
                path: "total",
                component: CheckworkCount,
                name: "考勤统计",
            },
            {
                path: "hours",
                component: CheckworkHours,
                name: "工时统计",
            },
            {
                path: "chart",
                component: CheckworkChart,
                name: "考勤图表",
            },
            {
                path: "vacation",
                component: VacationIndex,
                name: "假期管理",
            },
            {
                path: "holiday",
                component: HolidayIndex,
                name: "节假日",
            }
        ]
    },
    {
        path: "/apply",
        redirect: "/apply/task",
        component: Home,
        name: "审批管理",
        children: [
            {
                path: "task",
                component: TaskList,
                name: "任务申请",
                hidden: true,
            },
            {
                path: "task/form",
                component: TaskForm,
                name: "任务发布",
                hidden: true
            },
            {
                path: "clock",
                component: ClockList,
                name: "未打卡列表",
                hidden: true
            },
            {
                path: "clock/form",
                component: ClockForm,
                name: "未打卡申请",
                hidden: true
            },
            {
                path:"clock/approver"  ,
                component:clockApprover,
                name:"我的未打卡审批",
                hidden: true
            },
            {
                path: "clock/info/:clockId",
                component: ClockInfo,
                name: "未打卡详情",
                hidden: true
            },
            {
                path: "businesstrip",
                component: BusinesstripList,
                name: "出差列表",
                hidden: true
            },
            {
                path: "businesstrip/form",
                component: BusinesstripForm,
                name: "出差申请",
                hidden: true,
            },
            {
                path:'businesstrip/approver' ,
                component:BusinesstripApprover,
                name:'我的出差审批',
                hidden: true
            },
            {
                path: "businesstrip/info/:businesstripId",
                component: BusinesstripInfo,
                name: "出差详情",
                hidden: true
            },

            {
                path: "goout",
                component: GooutList,
                name: "我的外出申请",
                hidden: true,
                children:[

                ]
            },
            {
                path: "goout/approver",
                component: GooutApprover,
                name: "我的外出审批",
                hidden: true
            },
            {
                path: "goout/form",
                component: GooutForm,
                name: "外出申请",
                hidden: true
            },
            {
                path: "goout/info/:gooutId",
                component: GooutInfo,
                name: "外出详情",
                hidden: true
            },
            {
                path: "goout/look",
                component: GooutLook,
                name: "查看外出",
                hidden: true
            },
            {
                path: "leave",
                component: LeaveList,
                name: "请假列表",
                hidden: true
            },
            {
                path: "leave/form",
                component: LeaveForm,
                name: "请假申请",
                hidden: true
            },
            {
                path:"leave/approver",
                component:LeaveApprover,
                name:"我的请假审批",
                hidden: true
            },
            {
                path: "leave/info/:leaveId",
                component: LeaveInfo,
                name: "请假详情",
                hidden: true
            },
            {
                path: "invoice",
                component: InvoiceList,
                name: "报销列表",
                hidden: true
            },
            {
                path: "invoice/form",
                component: InvoiceForm,
                name: "报销申请",
                hidden: true
            },

            {
                path:"invoice/approver",
                component:InvoiceApprover,
                name:"我的报销审批",
                hidden: true
            },

            {
                path: "invoice/look",
                component: InvoiceLook,
                name: "查看报销",
                hidden: true
            },
            {
                path: "invoice/info/:invoiceId",
                component: InvoiceInfo,
                name: "报销详情",
                hidden: true
            },
            {
                path: "expense",
                component: ExpenseList,
                name: "支出列表",
                hidden: true
            },
            {
                path:"expense/approver",
                component:ExpenseApprover,
                name:"我的支出审批",
                hidden: true
            },
            {
                path: "expense/form",
                component: ExpenseForm,
                name: "支出申请",
                hidden: true
            },
            {
                path: "expense/info/:expenseId",
                component: ExpenseInfo,
                name: "支出详情",
                hidden: true
            },
            {
                path: "receipt",
                component: ReceiptList,
                name: "开票列表",
                hidden: true
            },
            {
                path:"receipt/approver",
                component:ReceiptApprover,
                name:"我的开票审批",
                hidden: true
            },
            {
                path: "receipt/form",
                component: ReceiptForm,
                name: "开票申请",
                hidden: true
            },
            {
                path: "receipt/info/:receiptId",
                component: ReceiptInfo,
                name: "开票详情",
                hidden: true
            },
            {
                path:"receipt/look",
                component:ReceiptLook,
                name:"查看开票",
                hidden: true
            }
        ]
    },
    {
        path: "/customer",
        redirect: "/customer/firstpartyList",
        component: Home,
        // icon: "guanggao",
        name: "CRM",
        // noDropdown: true,
        children: [
            {
                path:"firstpartyList",
                component:FirstPartyList,
                name:"客户管理",
                hidden: true
            },
            {
                path:"supplierList",
                component:SupplierList,
                name:"供应商管理",
                hidden: true
            }
        ]
    },
    {
        path: "/project",
        redirect: "/project/item",
        component: Home,
        icon: "guanggao",
        name: "项目管理",
        // noDropdown: true,
        children: [
            {
                path: "item",
                component: Item,
                name: "全部项目",
            },
            {
                path: "itemAdmin",
                component: ItemAdmin,
                name: "我负责的",
            },
            {
                path: "itemPart",
                component: ItemPart,
                name: "我参与的",
            },
            {
                path: "itemApprover",
                component: ItemApprover,
                name: "我审批的",
            },
            {
                path: "itemForm",
                component: ItemForm,
                name: "添加或修改项目",
            },
            {
                path: "itemInfo/:itemId",
                component: ItemInfo,
                name: "项目详情",
            },
            {
                path: "Total",
                component: Total,
                name: "项目总览",
            }
        ]
    },
    {
        path: "/money",
        redirect: "/money/Company",
        component: Home,
        icon: "guanggao",
        name: "财务管理",
        children: [
            // {
            //     path: "Company",
            //     component: Company,
            //     name: "公司汇总",
            // },
            // {
            //     path: "Project",
            //     component: Project,
            //     name: "项目汇总",
            // },
            // {
            //     path: "Gathers",
            //     component: Gathers,
            //     name: "人员汇总",
            // },
            // {
            //     path: "moneyHome",
            //     component: moneyHome,
            //     name: "住房补助汇总",
            // }
        ]
    },
    {
        path: "/standard",
        redirect: "/standard/apply",
        component: Home,
        icon: "guanggao",
        name: "标准文档",
        children: [
            {
                path: "apply",
                component: StandardApply,
                name: "审批规范",
            },
            // {
            //     path: "Mine",
            //     component: Mine,
            //     name: "我的文档",
            // }
        ]
    },
    {
        path: "/admin",
        redirect: "/admin/Staff",
        component: Home,
        icon: "guanggao",
        name: "系统管理",
        children: [
            {
                path: "user",
                component: User,
                name: "员工",
            },
            {
                path: "dept",
                component: Department,
                name: "部门",
            },
            {
                path: "company",
                component: Company,
                name: "公司",
            },
            {
                path: "notice",
                component: Notice,
                name: "公告",
            },
            {
                path: "Performance",
                component: Performance,
                name: "绩效",
            },
            {
                path: "log",
                component: Log,
                name: "绩效",
            }
        ]
    },
    {
        path: "/other",
        redirect: "/other/menu",
        component: Home,
        icon: "guanggao",
        name: "其他管理",
        children: [
            {
                path: "menu",
                component: Menu,
                name: "菜单管理",
            },
            {
                path: "role",
                component: Role,
                name: "角色管理",
            },
            {
                path: "quartz",
                component: Quartz,
                name: "任务管理",
            },
            {
                path: "log",
                component: Log,
                name: "日志管理",
            },
        ]
    }
];
