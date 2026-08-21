<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\DashboardMenuController;
use App\Http\Controllers\RolePermissionController;

use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/login');

Route::get('maintenance', function () {
    return Inertia::render('Maintenance');
})->name('maintenance');

Route::middleware(['auth', 'role.permission'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

    Route::get('routes', [RouteController::class, 'index'])->name('routes.index');
    Route::get('routes/bulk-create', [RouteController::class, 'bulkCreate'])->name('routes.bulk-create');
    Route::get('routes/create', [RouteController::class, 'create'])->name('routes.create');
    Route::post('routes', [RouteController::class, 'store'])->name('routes.store');
    Route::get('routes/{route}/edit', [RouteController::class, 'edit'])->name('routes.edit');
    Route::put('routes/{route}', [RouteController::class, 'update'])->name('routes.update');
    Route::delete('routes/{route}', [RouteController::class, 'destroy'])->name('routes.destroy');
    Route::get('routes', [RouteController::class, 'index'])->name('routes.index');

    Route::get('dashboard-menus', [DashboardMenuController::class, 'index'])->name('dashboard-menus.index');
    Route::get('dashboard-menus/create', [DashboardMenuController::class, 'create'])->name('dashboard-menus.create');
    Route::post('dashboard-menus', [DashboardMenuController::class, 'store'])->name('dashboard-menus.store');
    Route::post('dashboard-menus/reorder', [DashboardMenuController::class, 'reorder'])->name('dashboard-menus.reorder');
    Route::get('dashboard-menus/{dashboardMenu}/edit', [DashboardMenuController::class, 'edit'])->name('dashboard-menus.edit');
    Route::put('dashboard-menus/{dashboardMenu}', [DashboardMenuController::class, 'update'])->name('dashboard-menus.update');
    Route::delete('dashboard-menus/{dashboardMenu}', [DashboardMenuController::class, 'destroy'])->name('dashboard-menus.destroy');

    Route::get('dashboard-menu-sections', [App\Http\Controllers\DashboardMenuSectionController::class, 'index'])->name('dashboard-menu-sections.index');
    Route::get('dashboard-menu-sections/create', [App\Http\Controllers\DashboardMenuSectionController::class, 'create'])->name('dashboard-menu-sections.create');
    Route::post('dashboard-menu-sections', [App\Http\Controllers\DashboardMenuSectionController::class, 'store'])->name('dashboard-menu-sections.store');
    Route::post('dashboard-menu-sections/reorder', [App\Http\Controllers\DashboardMenuSectionController::class, 'reorder'])->name('dashboard-menu-sections.reorder');
    Route::get('dashboard-menu-sections/{dashboardMenuSection}/edit', [App\Http\Controllers\DashboardMenuSectionController::class, 'edit'])->name('dashboard-menu-sections.edit');
    Route::put('dashboard-menu-sections/{dashboardMenuSection}', [App\Http\Controllers\DashboardMenuSectionController::class, 'update'])->name('dashboard-menu-sections.update');
    Route::delete('dashboard-menu-sections/{dashboardMenuSection}', [App\Http\Controllers\DashboardMenuSectionController::class, 'destroy'])->name('dashboard-menu-sections.destroy');

    Route::get('role-permissions', [RolePermissionController::class, 'index'])->name('role-permissions.index');
    Route::get('role-permissions/create', [RolePermissionController::class, 'create'])->name('role-permissions.create');
    Route::post('role-permissions', [RolePermissionController::class, 'store'])->name('role-permissions.store');
    Route::get('role-permissions/{role_permission}/edit', [RolePermissionController::class, 'edit'])->name('role-permissions.edit');
    Route::put('role-permissions/{role_permission}', [RolePermissionController::class, 'update'])->name('role-permissions.update');
    Route::delete('role-permissions/{role_permission}', [RolePermissionController::class, 'destroy'])->name('role-permissions.destroy');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('urgencies', [App\Http\Controllers\UrgencyController::class, 'index'])->name('urgencies.index');
    Route::get('urgencies/create', [App\Http\Controllers\UrgencyController::class, 'create'])->name('urgencies.create');
    Route::post('urgencies', [App\Http\Controllers\UrgencyController::class, 'store'])->name('urgencies.store');
    Route::get('urgencies/{urgency}/edit', [App\Http\Controllers\UrgencyController::class, 'edit'])->name('urgencies.edit');
    Route::put('urgencies/{urgency}', [App\Http\Controllers\UrgencyController::class, 'update'])->name('urgencies.update');
    Route::delete('urgencies/{urgency}', [App\Http\Controllers\UrgencyController::class, 'destroy'])->name('urgencies.destroy');

    Route::get('statuses', [App\Http\Controllers\StatusController::class, 'index'])->name('statuses.index');
    Route::get('statuses/create', [App\Http\Controllers\StatusController::class, 'create'])->name('statuses.create');
    Route::post('statuses', [App\Http\Controllers\StatusController::class, 'store'])->name('statuses.store');
    Route::get('statuses/{status}/edit', [App\Http\Controllers\StatusController::class, 'edit'])->name('statuses.edit');
    Route::put('statuses/{status}', [App\Http\Controllers\StatusController::class, 'update'])->name('statuses.update');
    Route::delete('statuses/{status}', [App\Http\Controllers\StatusController::class, 'destroy'])->name('statuses.destroy');

    Route::get('devisions', [App\Http\Controllers\DevisionController::class, 'index'])->name('devisions.index');
    Route::get('devisions/create', [App\Http\Controllers\DevisionController::class, 'create'])->name('devisions.create');
    Route::post('devisions', [App\Http\Controllers\DevisionController::class, 'store'])->name('devisions.store');
    Route::get('devisions/{devision}/edit', [App\Http\Controllers\DevisionController::class, 'edit'])->name('devisions.edit');
    Route::put('devisions/{devision}', [App\Http\Controllers\DevisionController::class, 'update'])->name('devisions.update');
    Route::delete('devisions/{devision}', [App\Http\Controllers\DevisionController::class, 'destroy'])->name('devisions.destroy');

    Route::get('profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
