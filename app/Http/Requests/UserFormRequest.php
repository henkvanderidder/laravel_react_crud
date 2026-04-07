<?php

namespace App\Http\Requests;

//use Illuminate\Container\Attributes\Log;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Http\FormRequest;

class UserFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        Log::info('Validating user form request for email: ' . 'required|string|email|max:255|unique:users,email,-'.$this->route('user')->id.'-');
        /* allow the same email for the current user  */
        return [

            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$this->route('user')->id,  
            'avatar' => 'nullable|image|max:2048|mimes:jpg,jpeg,png,gif,bmp,svg',
            //
        ];
    }

    /**
     * Get custom messages for validator errors.
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter the user name.',
            'name.string' => 'The user name must be a string.',
            'name.max' => 'The user name may not be greater than 255 characters.',
            'email.required' => 'Please enter the email.',
            'email.string' => 'The email must be a string.',
            'email.max' => 'The email may not be greater than 250 characters.',
            'email.email' => 'The email must be a valid email address.',
            'email.unique' => 'The email has already been taken.',
            'avatar.image' => 'The avatar must be an image file.',
            'avatar.max' => 'The avatar size may not be greater than 2 MB.',
            'avatar.mimes' => 'The avatar must be a file of type: jpg, jpeg, png, gif.',
        ];
    }   

}
