using System.ComponentModel.DataAnnotations;

namespace UserProfile.Api.Models;

public class ProfileRequest
{
    [Required, StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Phone]
    public string? PhoneNumber { get; set; }

    [StringLength(500)]
    public string? Bio { get; set; }

    [Url]
    public string? AvatarUrl { get; set; }
}
