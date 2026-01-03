<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\ProductFormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Exception;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        //dd('Product Index');
        $products = Product::latest()->get()->map(fn($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'featured_image' => $product->featured_image ? asset('storage/' . $product->featured_image) : null,
            'created_at' => $product->created_at->format('d-m-Y'),
        ]);
        return Inertia::render('products/index' , [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('products/product-form');
    }

    /**
     * Store a newly created resource in storage.
     * @param  \App\Http\Requests\ProductFormRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */

    public function store(ProductFormRequest $request)
    {
        //
        //dd($request->all());

        try {
            // handle file upload
            $featuredImage = null;
            $featuredImageOriginalName = null;

            if ($request->file('featured_image')) {
                $featuredImage = $request->file('featured_image');
                $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                $featuredImage = $featuredImage->store('products','public'); 
            }
            
            // write to database
            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'featured_image' => $featuredImage,
                'featured_image_original_name' => $featuredImageOriginalName,
            ]);

            if ($product) {
                return redirect()->route('products.index')->with('success', 'Product created successfully.');
            }
            
            // stay on the same page with error message
            return redirect()->back()->with('error', 'Failed to create product. Please try again.');

        } catch (Exception $e) {
            Log::error('File upload error: ' . $e->getMessage());
        }   
        return redirect()->back()->with('error', 'An unexpected error occurred. Please try again.');       
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
        //dd($product);
        if ($product->featured_image) {
            $product->featured_image = asset('storage/' . $product->featured_image);
        }

        return Inertia::render('products/product-form', [
            'product' => $product,
            'isView' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
        if ($product->featured_image) {
            $product->featured_image = asset('storage/' . $product->featured_image);
        }

        return Inertia::render('products/product-form', [
            'product' => $product,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductFormRequest $request, Product $product)
    {
        try {
            if ($product) {
                $product->name        = $request->name;
                $product->description = $request->description;
                $product->price       = $request->price;

                if ($request->file('featured_image')) {
                    $featuredImage             = $request->file('featured_image');
                    $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                    $featuredImage             = $featuredImage->store('products', 'public');

                    $product->featured_image               = $featuredImage;
                    $product->featured_image_original_name = $featuredImageOriginalName;
                }

                $product->save();

                return redirect()->route('products.index')->with('success', 'Product updated successfully.');
            }
            return redirect()->back()->with('error', 'Unable to update product. Please try again!');

        } catch (Exception $e) {
            Log::error('Product update failed: ' . $e->getMessage());
        }
        return redirect()->back()->with('error', 'An unexpected error occurred. Please try again.');       

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
        try {
            if ($product) {
                $product->delete();

                return redirect()->back()->with('success', 'Product deleted successfully.');
            }
            return redirect()->back()->with('error', 'Unable to delete product. Please try again!');

        } catch (Exception $e) {
            Log::error('Product deletion failed: ' . $e->getMessage());
        }
        return redirect()->back()->with('error', 'An unexpected error occurred. Please try again.');       

    }
}

