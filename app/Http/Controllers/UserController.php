<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\UserFormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Exception;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $users = User::query();
        if ($request->filled('search')) {
            $search = $request->search;
            $users->where(fn($query) => 
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
            );
        }

        $perPage = (int) ($request->perPage ?? 5);
        if ($perPage === -1) {
            $users = $users->latest()->get()->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'created_at' => $user->created_at->format('d-m-Y'),
            ]);
            $usersPage = [
                'data' => $users,
                'total' => $users->count(),
                'per_page' => $perPage,
                'from' => 1,
                'to' => $users->count(),
                'links' => [],
            ];
        } else {
            $usersPage = $users->latest()->paginate($perPage)->withQueryString();
            $usersPage->getCollection()->transform(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'created_at' => $user->created_at->format('d-m-Y'),
            ]);
        }



        return Inertia::render('users/index' , [
            'usersPage' => $usersPage,
            'filters' => $request->only(['search', 'perPage']),
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('users/user-form');
    }

    /**
     * Store a newly created resource in storage.
     * @param  \App\Http\Requests\UserFormRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */

    public function store(UserFormRequest $request)
    {
        //
        //dd($request->all());

        try {
            // handle file upload
            $avatar = null;
            $avatarOriginalName = null;

            if ($request->file('avatar')) {
                $avatar = $request->file('avatar');
                $avatarOriginalName = $avatar->getClientOriginalName();
                $avatar = $avatar->store('users','public'); 
            }
            
            // write to database
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'avatar' => $avatar,
                'avatar_original_name' => $avatarOriginalName,
                'password' => bcrypt('Testen@1234'),
            ]);

            if ($user) {
                Log::info('User created successfully: ' . $user->id);
                return redirect()->route('users.index')->with('success', 'User created successfully.');
            }
            
            // stay on the same page with error message
            Log::error('Failed to create user. Please try again: ' . $request->email);
            return redirect()->back()->with('error', 'Failed to create user. Please try again.');

        } catch (Exception $e) {
            Log::error('File upload error: ' . $e->getMessage());
        }  
        Log::error('An unexpected error occurred while creating user: ' . $request->email); 
        return redirect()->back()->with('error', 'An unexpected error occurred. Please try again.');       
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
        //dd($user);
        if ($user->avatar) {
            $user->avatar = asset('storage/' . $user->avatar);
        }

        return Inertia::render('users/user-form', [
            'user' => $user,
            'isView' => true,
       ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
        if ($user->avatar) {
            $user->avatar = asset('storage/' . $user->avatar);
        }

        return Inertia::render('users/user-form', [
            'user' => $user,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserFormRequest $request, User $user)
    {
        try {
            if ($user) {
                $user->name  = $request->name;
                if ($user->email !== $request->email) {
                    // geen oplossing
                    Log::info('Email changed for user: ' . $user->id. ' from ' . $user->email . ' to ' . $request->email);
                    $user->email = $request->email;
                    
                } else {
                    Log::info('Email unchanged for user: ' . $user->id);
                }

                if ($request->file('avatar')) {
                    $avatar             = $request->file('avatar');
                    $avatarOriginalName = $avatar->getClientOriginalName();
                    $avatar             = $avatar->store('users', 'public');

                    $user->avatar               = $avatar;
                    $user->avatar_original_name = $avatarOriginalName;
                }

                $user->save();
                Log::info('User updated successfully: ' . $user->id);
                return redirect()->route('users.index')->with('success', 'User updated successfully.');
            }
            Log::error('Unable to update user. Please try again: ' . $user->id);
            return redirect()->back()->with('error', 'Unable to update user. Please try again!');

        } catch (Exception $e) {
            Log::error('User update failed: ' . $e->getMessage());
        }
        Log::error('An unexpected error occurred while updating user');
        return redirect()->back()->with('error', 'An unexpected error occurred. Please try again.');       

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
        // dd($user);
        // return redirect()->back()->with('error', 'Unable to delete user. Please try again!');

        try {
            if ($user) {
                $user->delete();

                return redirect()->back()->with('success', 'User deleted successfully.');
            }
            return redirect()->back()->with('error', 'Unable to delete user. Please try again!');

        } catch (Exception $e) {
            Log::error('User deletion failed: ' . $e->getMessage());
        }
        return redirect()->back()->with('error', 'An unexpected error occurred. Please try again.');       

    }
}

