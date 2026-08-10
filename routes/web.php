<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\DashboardMenuController;
use App\Http\Controllers\RolePermissionController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role.permission'])->group(function () {
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

    Route::get('tokens', [\App\Http\Controllers\TokenController::class, 'index'])->name('tokens.index');
    Route::get('tokens/create', [\App\Http\Controllers\TokenController::class, 'create'])->name('tokens.create');
    Route::post('tokens', [\App\Http\Controllers\TokenController::class, 'store'])->name('tokens.store');
    Route::delete('tokens/{token}', [\App\Http\Controllers\TokenController::class, 'destroy'])->name('tokens.destroy');

    Route::get('participants', [\App\Http\Controllers\ParticipantController::class, 'index'])->name('participants.index');
    Route::get('participants/{participant}', [\App\Http\Controllers\ParticipantController::class, 'show'])->name('participants.show');
    Route::delete('participants/{participant}', [\App\Http\Controllers\ParticipantController::class, 'destroy'])->name('participants.destroy');
});

require __DIR__.'/auth.php';
