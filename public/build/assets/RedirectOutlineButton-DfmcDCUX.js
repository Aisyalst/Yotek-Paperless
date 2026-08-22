import{o as e,r as t,t as n}from"./app-CtMxOce1.js";var r=n();function i({text:n,href:i,className:a=``,routeName:o=``}){let{auth:s}=e().props,c=s?.permissions||[];return o&&!c.includes(o)?null:(0,r.jsx)(t,{href:i,className:`
            px-3 py-1 border-2 border-blue-500 bg-blue-500/10 text-blue-400 text-semibold rounded hover:bg-blue-600 hover:text-white transition-colors rounded-md text-xs font-medium shadow-sm
            ${a}
        `,children:n})}export{i as t};