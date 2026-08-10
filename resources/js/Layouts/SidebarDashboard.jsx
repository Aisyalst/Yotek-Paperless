import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Menu from '../Components/SidebarMenuDash';
import * as HiIcons from "react-icons/hi";

export default function Sidebar({ isOpen, onClose }) {
    const { sidebarMenus = [], auth = {} } = usePage().props;
    const { url } = usePage();
    const permissions = auth.permissions || [];

    // Filter and map children dynamically based on user permissions
    const filteredMenus = sidebarMenus
        .map(menu => {
            if (menu.type === 'Dropdown' && menu.children && menu.children.length > 0) {
                const allowedChildren = menu.children.filter(child => 
                    child.route && permissions.includes(child.route.route_name)
                );
                return {
                    ...menu,
                    children: allowedChildren
                };
            }
            return menu;
        })
        .filter(menu => {
            if (menu.type === 'Single') {
                return menu.route && permissions.includes(menu.route.route_name);
            }
            if (menu.type === 'Dropdown') {
                return menu.children && menu.children.length > 0;
            }
            return false;
        });

    const HiHome = HiIcons.HiHome;
    const HiX = HiIcons.HiX;

    const [openDropdowns, setOpenDropdowns] = useState({});

    const isRouteActive = (link) => {
        if (!link) return false;
        let relativeLink = link;
        try {
            if (link.startsWith('http://') || link.startsWith('https://')) {
                relativeLink = new URL(link).pathname;
            }
        } catch (e) {}
        
        const cleanUrl = url.split('?')[0];
        const cleanLink = relativeLink.split('?')[0];
        
        if (cleanLink === '/') {
            return cleanUrl === '/';
        }
        
        return cleanUrl === cleanLink || (cleanUrl.startsWith(cleanLink + '/') && !cleanUrl.startsWith(cleanLink + '/create'));
    };

    useEffect(() => {
        filteredMenus.forEach(menu => {
            if (menu.type === 'Dropdown' && menu.children && menu.children.length > 0) {
                const hasActiveChild = menu.children.some(child => {
                    const link = child.route ? route(child.route.route_name) : '#';
                    return isRouteActive(link);
                });
                if (hasActiveChild) {
                    setOpenDropdowns(prev => ({
                        ...prev,
                        [menu.id]: true
                    }));
                }
            }
        });
    }, [url, filteredMenus]);

    const toggleDropdown = (id) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Group menus by section
    const groupedMenus = filteredMenus.reduce((acc, menu) => {
        const section = menu.section || 'General';
        if (!acc[section]) {
            acc[section] = [];
        }
        acc[section].push(menu);
        return acc;
    }, {});

    const renderMenuItem = (menu) => {
        const IconComponent = HiIcons[menu.icon] || HiIcons.HiFolder;
        
        if (menu.type === 'Dropdown' && menu.children && menu.children.length > 0) {
            const isOpen = !!openDropdowns[menu.id];
            const hasActiveChild = menu.children.some(child => {
                const link = child.route ? route(child.route.route_name) : '#';
                return isRouteActive(link);
            });
            const ChevronIcon = isOpen ? HiIcons.HiChevronDown : HiIcons.HiChevronRight;

            return (
                <li key={menu.id} className="relative list-none">
                    {/* Parent Menu Toggle Button */}
                    <button
                        onClick={() => toggleDropdown(menu.id)}
                        className={`transition duration-300 ease-in-out block mx-5 my-2 ps-[5%] pe-5 py-2 text-sm font-semibold transition-colors rounded-md hover:translate-x-1 flex items-center justify-between text-left border ${
                            hasActiveChild 
                                ? 'bg-[#252526] text-white border border-zinc-700 font-bold' 
                                : 'text-gray-200 border border-transparent hover:border-zinc-700 hover:bg-[#252526]/60 hover:text-white'
                        }`}
                        style={{ width: 'calc(100% - 40px)' }}
                    >
                        <span className="flex items-center">
                            <IconComponent className="inline me-2 w-5 h-5" />
                            {menu.name}
                        </span>
                        <ChevronIcon className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* Collapsible Children List */}
                    {isOpen && (
                        <ul className="ms-5 pl-2 border-l border-zinc-700">
                            {menu.children.map((child) => {
                                const ChildIcon = HiIcons[child.icon] || HiIcons.HiFolder;
                                const childLink = child.route ? route(child.route.route_name) : '#';
                                return (
                                    <Menu
                                        key={child.id}
                                        link={childLink}
                                        label={child.name}
                                        svg={<ChildIcon className="inline me-2 w-5 h-5" />}
                                    />
                                );
                            })}
                        </ul>
                    )}
                </li>
            );
        }

        // Standalone Single Menu Item
        const link = menu.route ? route(menu.route.route_name) : '#';
        return (
            <Menu 
                key={menu.id} 
                link={link} 
                label={menu.name} 
                svg={<IconComponent className="inline me-2 w-5 h-5" />} 
            />
        );
    };

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#252526] border-r border-zinc-700 text-gray-200 flex flex-col transition-transform duration-300 ease-in-out transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0`}>
            
            {/* Bagian Logo */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-700">
                <span>
                    <div className="flex items-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Laravel.svg/1280px-Laravel.svg.png" alt="" className="w-10 h-10" />
                        <span className="text-xl font-bold text-blue-500"></span>
                        <p className="text-gray-200 font-semibold"></p>
                    </div>
                </span>
                <button 
                    onClick={onClose}
                    className="lg:hidden p-1.5 rounded-md text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 focus:outline-none"
                    aria-label="Close Sidebar"
                >
                    <HiX className="w-5 h-5" />
                </button>
            </div>

            {/* Bagian Menu */}
            <nav className="flex-1 overflow-y-auto h-full">
                <ul className="h-full flex flex-col pt-5">
                    <Menu link="/" label="Dashboard" svg={<HiHome className="inline me-2 w-5 h-5" />} />
                    
                    {Object.entries(groupedMenus).map(([sectionName, items]) => (
                        <React.Fragment key={sectionName}>
                            <div className={`px-4 py-2 text-xs font-semibold text-white uppercase ${
                                sectionName === 'Settings' ? 'mt-auto' : 'mt-4'
                            }`}>
                                {sectionName}
                            </div>
                            {items.map((menu) => renderMenuItem(menu))}
                        </React.Fragment>
                    ))}
                </ul>
            </nav>

            {/* Bagian Bawah Sidebar (Opsional) */}
            <div className="p-4 border-t border-zinc-700 mt-5">
                <p className="text-xs text-white">© 2026 Aplikasi Saya</p>
            </div>
        </aside>
    );
}