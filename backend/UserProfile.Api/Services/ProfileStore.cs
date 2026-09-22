using System.Collections.Concurrent;
using UserProfile.Api.Models;

namespace UserProfile.Api.Services;

public class ProfileStore
{
    private readonly ConcurrentDictionary<Guid, Profile> _profiles = new();

    public ProfileStore()
    {
        var seed = new Profile
        {
            Id = Guid.NewGuid(),
            FullName = "Somchai Jaidee",
            Email = "somchai.jaidee@example.com",
            PhoneNumber = "081-234-5678",
            Bio = "Software engineer who loves the sea.",
            AvatarUrl = "https://i.pravatar.cc/150?img=12"
        };
        _profiles[seed.Id] = seed;
    }

    public IEnumerable<Profile> GetAll() => _profiles.Values;

    public Profile? GetById(Guid id) => _profiles.GetValueOrDefault(id);

    public Profile Create(Profile profile)
    {
        profile.Id = Guid.NewGuid();
        _profiles[profile.Id] = profile;
        return profile;
    }

    public bool Update(Guid id, Profile profile)
    {
        if (!_profiles.ContainsKey(id))
        {
            return false;
        }

        profile.Id = id;
        _profiles[id] = profile;
        return true;
    }

    public bool Delete(Guid id) => _profiles.TryRemove(id, out _);
}
