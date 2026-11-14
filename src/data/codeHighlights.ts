export interface CodeHighlight {
  filename: string;
  language: 'cpp' | 'csharp';
  summary: string;
  code: string;
}

export const CODE_HIGHLIGHTS: Record<string, CodeHighlight[]> = {
  'live-wire': [
    {
      filename: 'GridLaser.cpp',
      language: 'cpp',
      summary: 'Multi-bounce line-trace laser routing & BushingID ignition',
      code: `void AGridLaser::FireLaserTrace(FVector Origin, FVector Dir, int32 BouncesLeft)
{
    FHitResult Hit;
    FVector End = Origin + Dir * MaxLaserDistance;
    if (GetWorld()->LineTraceSingleByChannel(Hit, Origin, End, ECC_Visibility))
    {
        DrawBeamSegment(Origin, Hit.ImpactPoint);
        if (ALaserTarget* Target = Cast<ALaserTarget>(Hit.GetActor()))
        {
            if (Target->TargetID == CellID)
                Target->IgniteMatchingBushings();
        }
        else if (BouncesLeft > 0 && Hit.GetActor()->ActorHasTag("Mirror"))
        {
            FVector Reflected = FMath::GetReflectionVector(Dir, Hit.ImpactNormal);
            FireLaserTrace(Hit.ImpactPoint + Reflected * 2.f, Reflected, BouncesLeft - 1);
        }
    }
}`,
    },
    {
      filename: 'EnemyBatteryThief.cpp',
      language: 'cpp',
      summary: '10-second battery detachment & drop-pad return loop',
      code: `void AEnemyBatteryThief::TickDetachment(float DeltaSeconds)
{
    if (!TargetCylinder || !TargetCylinder->HasBattery()) return;

    DetachProgress += DeltaSeconds / DetachDuration; // 10.0s default
    if (DetachProgress >= 1.0f)
    {
        ABatteryCapsule* Stolen = TargetCylinder->DetachBattery();
        AttachBatteryToBack(Stolen);
        MoveToDropPad(NearestDropSpot);
    }
}`,
    },
  ],
  'trap-rooms': [
    {
      filename: 'TrapRoom.cpp',
      language: 'cpp',
      summary: '10s timed trap room unlock, coin risk-reward & door lockdown',
      code: `void ATrapRoom::EnterTrapRoom(AGameCharacter* Player)
{
    if (bIsLocked || bRoomCleared) return;
    bPlayerInside = true;
    TimeLeft = TrapDuration; // 10.0s escape window
    GetWorldTimerManager().SetTimer(CountdownHandle, this, &ATrapRoom::TickTrapTimer, 0.1f, true);
}

void ATrapRoom::OnTimerExpired()
{
    if (bPlayerInside)
    {
        LockDoorMesh(true);
        GameMode->WipeUnbankedAndPenalize(10); // -10 BankedScore penalty
    }
}`,
    },
  ],
  'multiplayer-tic-tac-toe': [
    {
      filename: 'NetworkServer.cs',
      language: 'csharp',
      summary: 'Server-authoritative move validation & win/draw broadcast',
      code: `public void HandleMove(ClientSession sender, int cellIndex)
{
    if (sender.Symbol != CurrentTurn || cellIndex < 0 || cellIndex > 8)
    {
        SendPacket(sender, "MOVE_ERROR", "Invalid turn or cell index");
        return;
    }
    if (Board[cellIndex] != '\\0')
    {
        SendPacket(sender, "MOVE_ERROR", "Cell already occupied");
        return;
    }
    Board[cellIndex] = sender.Symbol;
    BroadcastAll($"MOVE_RESULT|{cellIndex}|{sender.Symbol}");
    CheckWinOrDraw();
}`,
    },
  ],
  'asteroid-survival': [
    {
      filename: 'PlayerMovement.cs',
      language: 'csharp',
      summary: '220°/s mouse-aimed rotation, thrust & proximity radar',
      code: `void Update()
{
    Vector3 mouseWorld = Camera.main.ScreenToWorldPoint(Input.mousePosition);
    Vector2 dir = (mouseWorld - transform.position);
    float targetAngle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg - 90f;
    transform.rotation = Quaternion.RotateTowards(
        transform.rotation, Quaternion.Euler(0, 0, targetAngle), turnSpeed * Time.deltaTime);

    if (Input.GetMouseButton(0))
        rb.AddForce(transform.up * thrustForce * Time.deltaTime);
}`,
    },
  ],
  'sphere-runner': [
    {
      filename: 'E_EnemyChase.cs',
      language: 'csharp',
      summary: 'NavMeshAgent relentless pursuit & 8.0-unit URP emission pulse',
      code: `void Update()
{
    agent.SetDestination(player.position);
    float dist = Vector3.Distance(transform.position, player.position);
    bool near = dist <= proximityDistance; // 8.0 units
    animator.SetBool("IsNearPlayer", near);

    if (near)
    {
        float t = 0.5f + 0.5f * Mathf.Sin(Time.time * pulseSpeed);
        Color c = Color.Lerp(lightRed, brightRed, t);
        matBlock.SetColor("_EmissionColor", c * 2.5f);
        rend.SetPropertyBlock(matBlock);
    }
}`,
    },
  ],
  'atmospheric-horror': [
    {
      filename: 'RealisticFlicker.cs',
      language: 'csharp',
      summary: 'Dual-sine organic light instability & coroutine audio fade',
      code: `void Update()
{
    float waveA = Mathf.Sin(Time.time * flickerSpeed) * 0.45f;
    float waveB = Mathf.Sin(Time.time * flickerSpeed * 0.7f) * 0.30f;
    targetLight.intensity = Mathf.Max(0.15f, baseIntensity + waveA + waveB);
}`,
    },
  ],
};
