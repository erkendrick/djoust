using UnityEditor;
using UnityEngine;
using UnityEngine.SocialPlatforms.Impl;

public class BotSpawner : MonoBehaviour
{
    public GameObject CircleBotPrefab;
    public GameObject ChaseBotPrefab;
    public float horizontalOffset = 7.1f;
    public float minVerticalPosition = 0.5f;
    public float maxverticalPosition = 3f;

    public float initialSpeed = 3f;
    public float initialAngularVelocity = 120f;

    private GameManager gameManager;
    private int lastChaseBotSpawnScore = 0;

    private void Start()
    {
        gameManager = FindObjectOfType<GameManager>();
    }

    private void Update()
    {
        if (GameObject.FindGameObjectsWithTag("CircleBot").Length == 0)
        {
            SpawnCircleBot();
        }
        int currentScore = gameManager.BotsDestroyed;
        if (currentScore >= lastChaseBotSpawnScore + 3)
        {
            SpawnChaseBot();
            lastChaseBotSpawnScore += 3;
        }
    }

    private void SpawnCircleBot()
    {
        int side = Random.Range(0, 2) * 2 - 1;
        float xPosition = side * horizontalOffset;

        float yPosition;
        if (Random.value < 0.5f)
        {
            yPosition = Random.Range(0.5f, 3f);
        }
        else
        {
            yPosition = Random.Range(-0.5f, -3f);
        }

        Vector2 spawnPosition = new Vector2(xPosition, yPosition);

        GameObject newBot = Instantiate(CircleBotPrefab, spawnPosition, Quaternion.identity);
        Rigidbody2D botRigidBody = newBot.GetComponent<Rigidbody2D>();
        botRigidBody.velocity = new Vector2(-side * initialSpeed, 0);
        botRigidBody.angularVelocity = initialAngularVelocity;
    }

    private void SpawnChaseBot()
    {
        int side = Random.Range(0, 2) * 2 - 1;
        float xPosition = side * horizontalOffset;

        float yPosition;
        if (Random.value < 0.5f)
        {
            yPosition = Random.Range(0.5f, 3f);
        }
        else
        {
            yPosition = Random.Range(-0.5f, -3f);
        }
        Vector2 spawnPosition = new Vector2(xPosition, yPosition);

        Instantiate(ChaseBotPrefab, spawnPosition, Quaternion.identity);
    }

    public void ResetSpawner()
    {
        lastChaseBotSpawnScore = 0;
    }
}
