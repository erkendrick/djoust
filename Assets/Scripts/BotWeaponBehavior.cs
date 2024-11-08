using UnityEngine;

public class BotWeaponBehavior : MonoBehaviour
{
    private void OnCollisionEnter2D(Collision2D collision)
    {
        // Check both the GameObject AND the specific collider we hit
        if (collision.gameObject.CompareTag("Player") && collision.collider.name != "Weapon")
        {
            FindObjectOfType<GameManager>().TriggerGameOver();
        }
    }
}