using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace asp_eshop.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<Product>>> GetProducts(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 9, 
        [FromQuery] string search = "",
        [FromQuery] string categoryId = "")
    {
        if (!string.IsNullOrEmpty(search) && search.Length < 3)
        {
            return BadRequest("Search term must be at least 3 characters long");
        }

        var query = _context.Products
            .Include(p => p.Category)
            .Select(p => new Product
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                CategoryId = p.CategoryId,
                Category = new Category 
                { 
                    Id = p.Category.Id, 
                    Name = p.Category.Name 
                }
            })
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));
        }

        if (!string.IsNullOrEmpty(categoryId) && int.TryParse(categoryId, out int catId))
        {
            query = query.Where(p => p.CategoryId == catId);
        }

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Product>
        {
            Items = items,
            Total = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Select(p => new Product
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                CategoryId = p.CategoryId,
                Category = new Category 
                { 
                    Id = p.Category.Id, 
                    Name = p.Category.Name 
                }
            })
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        return product;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(ProductDto product)
    {
        if (product.Price <= 0)
        {
            return BadRequest("Product price must be greater than zero.");
        }

        var category = await _context.Categories.FindAsync(product.CategoryId);
        if (category == null)
        {
            return BadRequest("Category not found");
        }

        var newProduct = new Product
        {
            Name = product.Name,
            Description = product.Description ?? "No description",
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            CategoryId = product.CategoryId,
            Category = category
        };

        _context.Products.Add(newProduct);
        await _context.SaveChangesAsync();

        var response = new Product
        {
            Id = newProduct.Id,
            Name = newProduct.Name,
            Description = newProduct.Description,
            Price = newProduct.Price,
            ImageUrl = newProduct.ImageUrl,
            CategoryId = newProduct.CategoryId,
            Category = new Category 
            { 
                Id = category.Id, 
                Name = category.Name 
            }
        };

        return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, response);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, ProductDto newProduct)
    {
        if (newProduct.Price <= 0)
        {
            return BadRequest("Product price must be greater than zero.");
        }

        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        if (string.IsNullOrEmpty(newProduct.Description))
        {
            newProduct.Description = "No description";
        }

        if (product.CategoryId != newProduct.CategoryId)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == newProduct.CategoryId);
            if (category == null)
            {
                return BadRequest("Category not found");
            }
            product.Category = category;
            product.CategoryId = newProduct.CategoryId;
        }

        product.Name = newProduct.Name;
        product.Description = newProduct.Description;
        product.Price = newProduct.Price;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ProductExists(int id)
    {
        return _context.Products.Any(e => e.Id == id);
    }
}

