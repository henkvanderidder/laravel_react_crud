<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductFormRequest extends FormRequest
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
        /*         name: '',
        description: '',
        price: '',
        featured_image: null as File | null,
        */
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'price' => 'required|numeric|min:0',
            'featured_image' => 'nullable|image|max:2048|mimes:jpg,jpeg,png,gif',
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
            'name.required' => 'Please enter the product name.',
            'name.string' => 'The product name must be a string.',
            'name.max' => 'The product name may not be greater than 255 characters.',
            'description.required' => 'Please enter the product description.',
            'description.string' => 'The product description must be a string.',
            'description.max' => 'The product description may not be greater than 1000 characters.',
            'price.required' => 'Please enter the product price.',
            'price.numeric' => 'The product price must be a number.',
            'price.min' => 'The product price must be at least 0.',
            'featured_image.image' => 'The featured image must be an image file.',
            'featured_image.max' => 'The featured image size may not be greater than 2 MB.',
            'featured_image.mimes' => 'The featured image must be a file of type: jpg, jpeg, png, gif.',
        ];
    }   
}
