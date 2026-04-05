/**
 * Phase 64-65: Brand Signal Amplification & Content Cluster Authority API
 * 브랜드 신호 강화 + 토픽 권한 구축 종합 엔진
 */

import { NextRequest, NextResponse } from "next/server";
import {
  calculateBrandSignalStrength,
  calculateEEATScore,
  evaluateEntityAuthority,
  generateBrandAmplificationStrategy,
  type BrandSignal,
  type EntityAuthorityMetrics,
} from "@/lib/brand-signal-amplifier";
import {
  generateContentCluster,
  evaluateTopicalAuthority,
  projectClusterImpact,
  generateHubSpokeInternalLinkingStrategy,
  generateTopicalAuthorityRoadmap,
  type ContentCluster,
} from "@/lib/content-cluster-builder";

/**
 * Phase 64-65: 브랜드 신호 + 토픽 권한 종합 최적화
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      // Brand metrics
      directTraffic = 800, // monthly
      brandSearchVolume = 45, // monthly
      mentionCount = 250,
      citationCount = 120,
      reviewCount = 85,
      averageRating = 4.6,
      contentQuality = 75,
      authorCredentials = 70,
      topicalAuthority = 65,
      userSatisfaction = 72,
      trustSignals = 80,

      // Cluster metrics
      hubKeyword = "Trending Topics",
      relatedKeywords = [
        "AI trends",
        "Technology news",
        "Global trends",
        "Social media trends",
        "Entertainment trends",
      ],
      relatedContentCount = 45,
      internalLinkCount = 120,
      backlinkCount = 85,
      averageDwellTime = 145,
      ctr = 4.2,
      lastUpdateDays = 8,
    } = body;

    // === Phase 64: Brand Signal Amplification ===

    const brandSignals = calculateBrandSignalStrength(
      directTraffic,
      brandSearchVolume,
      mentionCount,
      citationCount,
      reviewCount,
      averageRating
    );

    const eeatScore = calculateEEATScore(
      contentQuality,
      authorCredentials,
      topicalAuthority,
      userSatisfaction,
      trustSignals
    );

    const entityMetrics = evaluateEntityAuthority("IssueGlobe", {
      hasKnowledgeGraph: false,
      hasWikipedia: false,
      citationCount,
      consistentNAP: true,
      averageRating,
      reviewCount,
      eeatScore: eeatScore.totalEEAT,
    });

    const brandStrategy = generateBrandAmplificationStrategy(brandSignals, eeatScore);

    // === Phase 65: Content Cluster & Topical Authority ===

    const cluster = generateContentCluster(hubKeyword, relatedKeywords, []);

    const clusterAuthority = evaluateTopicalAuthority("Trending Topics Hub", {
      relatedContentCount,
      internalLinkCount,
      backlinksCount: backlinkCount,
      averageDwellTime,
      ctr,
      lastUpdateDays,
    });

    const clusterImpact = projectClusterImpact(cluster, {
      hubCurrentRank: 18,
      clusterAverageRank: 25,
    });

    const linkingStrategy = generateHubSpokeInternalLinkingStrategy(cluster);

    const roadmap = generateTopicalAuthorityRoadmap([cluster]);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),

        // === Phase 64: Brand Signals ===
        brandSignalAmplification: {
          overallBrandStrength: brandStrategy.totalBrandStrength,
          signals: brandSignals.slice(0, 3).map((s: BrandSignal) => ({
            signal: s.signal,
            type: s.type,
            strength: s.strength,
            impact: s.impact,
            implementation: s.implementation,
          })),
          signalSummary: {
            strong: brandSignals.filter((s: BrandSignal) => s.strength > 70).length,
            moderate: brandSignals.filter(
              (s: BrandSignal) => s.strength > 40 && s.strength <= 70
            ).length,
            weak: brandSignals.filter((s: BrandSignal) => s.strength <= 40).length,
          },
        },

        // === EEAT Analysis ===
        eeatAnalysis: {
          experience: `${eeatScore.experience}/100`,
          expertise: `${eeatScore.expertise}/100`,
          authoritativeness: `${eeatScore.authoritativeness}/100`,
          trustworthiness: `${eeatScore.trustworthiness}/100`,
          totalEEAT: `${eeatScore.totalEEAT}/100`,
          interpretation:
            eeatScore.totalEEAT > 75
              ? "✅ STRONG: Excellent EEA-T signals"
              : eeatScore.totalEEAT > 50
                ? "⚠️ MODERATE: Room for improvement"
                : "🔴 WEAK: Significant EEA-T gaps to address",
        },

        // === Entity Authority ===
        entityAuthority: {
          entityName: entityMetrics.entityName,
          knowledgeGraphCoverage: entityMetrics.googleKnowledgeGraphCoverage,
          wikipediaPresence: entityMetrics.wikipediaPresence,
          citations: `${entityMetrics.citationCount} mentions`,
          citationConsistency: `${entityMetrics.citationConsistency}% (NAP)`,
          socialProof: `${entityMetrics.averageRating}⭐ (${entityMetrics.reviewCount} reviews)`,
          authorityScore: entityMetrics.eeatScore,
          recommendations: [
            entityMetrics.googleKnowledgeGraphCoverage
              ? "✅ Knowledge Graph listed"
              : "⚠️ Apply for Knowledge Graph coverage",
            entityMetrics.wikipediaPresence
              ? "✅ Wikipedia entry exists"
              : "🔲 Consider Wikipedia entry (if notable)",
            entityMetrics.citationConsistency > 90
              ? "✅ Strong NAP consistency"
              : "⚠️ Audit and fix NAP inconsistencies",
            entityMetrics.averageRating > 4.5
              ? "✅ Strong review rating"
              : "🔲 Encourage more positive reviews",
          ],
        },

        // === Phase 65: Content Cluster ===
        contentCluster: {
          hubKeyword: cluster.hubKeyword,
          pillarUrl: cluster.pillarUrl,
          spokeCount: cluster.clusterTopics.length,
          topicalAuthority: cluster.topicalAuthority,
          implementationPriority: cluster.implementationPriority,
          spokesPreview: cluster.clusterTopics.slice(0, 3).map((spoke) => ({
            keyword: spoke.keyword,
            url: spoke.url,
            questionCount: spoke.relatedQuestions.length,
          })),
        },

        // === Topical Authority Metrics ===
        topicalAuthorityMetrics: {
          topicName: clusterAuthority.topicName,
          contentDepth: `${clusterAuthority.contentDepth}/100`,
          internalLinkDensity: `${clusterAuthority.internalLinkDensity}/100`,
          externalAuthority: `${clusterAuthority.externalAuthority}/100`,
          userEngagement: `${clusterAuthority.userEngagement}/100`,
          freshness: `${clusterAuthority.freshness}/100`,
          totalAuthorityScore: `${clusterAuthority.totalAuthorityScore}/100`,
          authorityInterpretation:
            clusterAuthority.totalAuthorityScore > 70
              ? "🏆 HIGH: Strong topical authority"
              : "📈 GROWING: Building authority over time",
        },

        // === Cluster Impact Projection ===
        clusterImpactProjection: {
          shortTerm: {
            timeframe: clusterImpact.shortTerm.timeframe,
            expectedHubRankImprovement: `Position 18 → ${clusterImpact.shortTerm.expectedRanks.hub}`,
            expectedClusterAverage: `Position 25 → ${Math.round(clusterImpact.shortTerm.expectedRanks.average)}`,
            estimatedTrafficGain: `+${clusterImpact.shortTerm.expectedTraffic} visits`,
          },
          longTerm: {
            timeframe: clusterImpact.longTerm.timeframe,
            expectedHubRankImprovement: `Position 18 → ${clusterImpact.longTerm.expectedRanks.hub}`,
            expectedClusterAverage: `Position 25 → ${Math.round(clusterImpact.longTerm.expectedRanks.average)}`,
            estimatedTrafficGain: `+${clusterImpact.longTerm.expectedTraffic} visits`,
            knowledgeGraphEligibility: `${clusterImpact.longTerm.knowledgeGraphProbability}% (if strong external signals)`,
          },
        },

        // === Internal Linking Strategy ===
        internalLinkingStrategy: {
          hubLinksOut: `${linkingStrategy.hubLinksOut} (to spokes + external)`,
          spokeLinksToHub: `${linkingStrategy.spokeLinksToHub} (all spokes → hub)`,
          spokesToSpokes: `${linkingStrategy.spokesToSpokes} (2-3 per spoke)`,
          anchorTextDistribution: {
            exactMatch: "30%",
            partialMatch: "30%",
            natural: "40%",
          },
          linkingTips: [
            "Hub pillar page: Title tag + H1 가장 최적화",
            "Hub page의 첫 단락에 모든 spoke 링크",
            "Spoke pages: Hub로 돌아오는 contextual links",
            "Spoke ↔ Spoke: 관련도 높은 것끼리만 연결",
          ],
        },

        // === Implementation Roadmap ===
        implementationRoadmap: roadmap.slice(0, 15),

        // === Combined Impact (Phase 64-65) ===
        combinedImpact: {
          brandStrengthImprovement: `${brandStrategy.totalBrandStrength}/100 (현재)`,
          expectedRankingBoost: brandStrategy.expectedRankingBoost,
          clusterAuthorityGain: `+${Math.round(clusterAuthority.totalAuthorityScore / 10)}-${Math.round(clusterAuthority.totalAuthorityScore / 5)} points`,
          estimatedTrafficMultiplier: "1.5-2.0x (2-3개월 내)",
          knowledgeGraphChance: "50-75% (full implementation 시)",
          effortLevel: "Medium (4-8주)",
          expectedROI: "Very High (branding + organic)",
        },

        // === Next Steps ===
        actionItems: [
          "1. EEAT 기초 강화 (Week 1-2)",
          "   - Privacy Policy, Contact, About 페이지 개선",
          "   - Author credentials 추가",
          "",
          "2. Brand Signal 증대 (Month 1-2)",
          "   - Direct traffic: 이메일 뉴스레터, 앱",
          "   - Brand search: PR, 소셜, 인플루언서",
          "   - Citations: 비즈니스 디렉토리 등록",
          "",
          "3. Content Cluster 구축 (Month 1-2)",
          "   - Pillar page: 4,000+ words comprehensive guide",
          "   - Spoke pages: 1,500-2,000 words each",
          "   - Hub-spoke internal linking (모두 bi-directional)",
          "",
          "4. 외부 신호 강화 (Month 2-3)",
          "   - Hub 페이지 백링크 확보",
          "   - Wikipedia, Knowledge Graph 등록",
          "   - 업계 언급 (co-mention) 구축",
        ],
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error("Phase 64-65 optimization error:", error);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Phase 64-65 optimization failed",
      },
      { status: 500 }
    );
  }
}
