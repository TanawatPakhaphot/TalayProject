using Microsoft.AspNetCore.Mvc;
using UserProfile.Api.Models;
using UserProfile.Api.Services;

namespace UserProfile.Api.Controllers;

[ApiController]
[Route("api/profiles")]
public class ProfilesController : ControllerBase
{
    private readonly ProfileStore _store;

    public ProfilesController(ProfileStore store)
    {
        _store = store;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Profile>> GetAll() => Ok(_store.GetAll());

    [HttpGet("{id:guid}")]
    public ActionResult<Profile> GetById(Guid id)
    {
        var profile = _store.GetById(id);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpPost]
    public ActionResult<Profile> Create(ProfileRequest request)
    {
        var created = _store.Create(ToProfile(Guid.Empty, request));
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id, ProfileRequest request)
    {
        var updated = _store.Update(id, ToProfile(id, request));
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id) => _store.Delete(id) ? NoContent() : NotFound();

    private static Profile ToProfile(Guid id, ProfileRequest request) => new()
    {
        Id = id,
        FullName = request.FullName,
        Email = request.Email,
        PhoneNumber = request.PhoneNumber,
        Bio = request.Bio,
        AvatarUrl = request.AvatarUrl
    };
}
