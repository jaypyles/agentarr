export interface JellyfinItem {
  Name: string;
  OriginalTitle: string;
  ServerId: string;
  Id: string;
  Etag: string;
  SourceType: string;
  PlaylistItemId: string;
  DateCreated: string;
  DateLastMediaAdded: string;
  ExtraType: string;
  AirsBeforeSeasonNumber: number;
  AirsAfterSeasonNumber: number;
  AirsBeforeEpisodeNumber: number;
  CanDelete: boolean;
  CanDownload: boolean;
  HasLyrics: boolean;
  HasSubtitles: boolean;
  PreferredMetadataLanguage: string;
  PreferredMetadataCountryCode: string;
  Container: string;
  SortName: string;
  ForcedSortName: string;
  Video3DFormat: string;
  PremiereDate: string;
  ExternalUrls:
    | []
    | [
        {
          Name: string;
          Url: string;
          [k: string]: unknown;
        },
      ];
  MediaSources:
    | []
    | [
        {
          Protocol: string;
          Id: string;
          Path: string;
          EncoderPath: string;
          EncoderProtocol: string;
          Type: string;
          Container: string;
          Size: number;
          Name: string;
          IsRemote: boolean;
          ETag: string;
          RunTimeTicks: number;
          ReadAtNativeFramerate: boolean;
          IgnoreDts: boolean;
          IgnoreIndex: boolean;
          GenPtsInput: boolean;
          SupportsTranscoding: boolean;
          SupportsDirectStream: boolean;
          SupportsDirectPlay: boolean;
          IsInfiniteStream: boolean;
          UseMostCompatibleTranscodingProfile: boolean;
          RequiresOpening: boolean;
          OpenToken: string;
          RequiresClosing: boolean;
          LiveStreamId: string;
          BufferMs: number;
          RequiresLooping: boolean;
          SupportsProbing: boolean;
          VideoType: string;
          IsoType: string;
          Video3DFormat: string;
          MediaStreams:
            | []
            | [
                {
                  Codec: string;
                  CodecTag: string;
                  Language: string;
                  ColorRange: string;
                  ColorSpace: string;
                  ColorTransfer: string;
                  ColorPrimaries: string;
                  DvVersionMajor: number;
                  DvVersionMinor: number;
                  DvProfile: number;
                  DvLevel: number;
                  RpuPresentFlag: number;
                  ElPresentFlag: number;
                  BlPresentFlag: number;
                  DvBlSignalCompatibilityId: number;
                  Rotation: number;
                  Comment: string;
                  TimeBase: string;
                  CodecTimeBase: string;
                  Title: string;
                  Hdr10PlusPresentFlag: boolean;
                  VideoRange: string;
                  VideoRangeType: string;
                  VideoDoViTitle: string;
                  AudioSpatialFormat: string;
                  LocalizedUndefined: string;
                  LocalizedDefault: string;
                  LocalizedForced: string;
                  LocalizedExternal: string;
                  LocalizedHearingImpaired: string;
                  DisplayTitle: string;
                  NalLengthSize: string;
                  IsInterlaced: boolean;
                  IsAVC: boolean;
                  ChannelLayout: string;
                  BitRate: number;
                  BitDepth: number;
                  RefFrames: number;
                  PacketLength: number;
                  Channels: number;
                  SampleRate: number;
                  IsDefault: boolean;
                  IsForced: boolean;
                  IsHearingImpaired: boolean;
                  Height: number;
                  Width: number;
                  AverageFrameRate: number;
                  RealFrameRate: number;
                  ReferenceFrameRate: number;
                  Profile: string;
                  Type: string;
                  AspectRatio: string;
                  Index: number;
                  Score: number;
                  IsExternal: boolean;
                  DeliveryMethod: string;
                  DeliveryUrl: string;
                  IsExternalUrl: boolean;
                  IsTextSubtitleStream: boolean;
                  SupportsExternalStream: boolean;
                  Path: string;
                  PixelFormat: string;
                  Level: number;
                  IsAnamorphic: boolean;
                  [k: string]: unknown;
                },
              ];
          MediaAttachments:
            | []
            | [
                {
                  Codec: string;
                  CodecTag: string;
                  Comment: string;
                  Index: number;
                  FileName: string;
                  MimeType: string;
                  DeliveryUrl: string;
                  [k: string]: unknown;
                },
              ];
          Formats: [] | [string];
          Bitrate: number;
          FallbackMaxStreamingBitrate: number;
          Timestamp: string;
          RequiredHttpHeaders: {
            property1: string;
            property2: string;
            [k: string]: unknown;
          };
          TranscodingUrl: string;
          TranscodingSubProtocol: string;
          TranscodingContainer: string;
          AnalyzeDurationMs: number;
          DefaultAudioStreamIndex: number;
          DefaultSubtitleStreamIndex: number;
          HasSegments: boolean;
          [k: string]: unknown;
        },
      ];
  CriticRating: number;
  ProductionLocations: [] | [string];
  Path: string;
  EnableMediaSourceDisplay: boolean;
  OfficialRating: string;
  CustomRating: string;
  ChannelId: string;
  ChannelName: string;
  Overview: string;
  Taglines: [] | [string];
  Genres: [] | [string];
  CommunityRating: number;
  CumulativeRunTimeTicks: number;
  RunTimeTicks: number;
  PlayAccess: string;
  AspectRatio: string;
  ProductionYear: number;
  IsPlaceHolder: boolean;
  Number: string;
  ChannelNumber: string;
  IndexNumber: number;
  IndexNumberEnd: number;
  ParentIndexNumber: number;
  RemoteTrailers:
    | []
    | [
        {
          Url: string;
          Name: string;
          [k: string]: unknown;
        },
      ];
  ProviderIds: {
    property1: string;
    property2: string;
    [k: string]: unknown;
  };
  IsHD: boolean;
  IsFolder: boolean;
  ParentId: string;
  Type: string;
  People:
    | []
    | [
        {
          Name: string;
          Id: string;
          Role: string;
          Type: string;
          PrimaryImageTag: string;
          ImageBlurHashes: {
            Primary: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            Art: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            Backdrop: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            Banner: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            Logo: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            Thumb: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            Disc: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            Box: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            Screenshot: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            Menu: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            Chapter: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            BoxRear: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            Profile: {
              property1: string;
              property2: string;
              [k: string]: unknown;
            };
            [k: string]: unknown;
          };
          [k: string]: unknown;
        },
      ];
  Studios:
    | []
    | [
        {
          Name: string;
          Id: string;
          [k: string]: unknown;
        },
      ];
  GenreItems:
    | []
    | [
        {
          Name: string;
          Id: string;
          [k: string]: unknown;
        },
      ];
  ParentLogoItemId: string;
  ParentBackdropItemId: string;
  ParentBackdropImageTags: [] | [string];
  LocalTrailerCount: number;
  UserData: {
    Rating: number;
    PlayedPercentage: number;
    UnplayedItemCount: number;
    PlaybackPositionTicks: number;
    PlayCount: number;
    IsFavorite: boolean;
    Likes: boolean;
    LastPlayedDate: string;
    Played: boolean;
    Key: string;
    ItemId: string;
    [k: string]: unknown;
  };
  RecursiveItemCount: number;
  ChildCount: number;
  SeriesName: string;
  SeriesId: string;
  SeasonId: string;
  SpecialFeatureCount: number;
  DisplayPreferencesId: string;
  Status: string;
  AirTime: string;
  AirDays: [] | [string];
  Tags: [] | [string];
  PrimaryImageAspectRatio: number;
  Artists: [] | [string];
  ArtistItems:
    | []
    | [
        {
          Name: string;
          Id: string;
          [k: string]: unknown;
        },
      ];
  Album: string;
  CollectionType: string;
  DisplayOrder: string;
  AlbumId: string;
  AlbumPrimaryImageTag: string;
  SeriesPrimaryImageTag: string;
  AlbumArtist: string;
  AlbumArtists:
    | []
    | [
        {
          Name: string;
          Id: string;
          [k: string]: unknown;
        },
      ];
  SeasonName: string;
  MediaStreams:
    | []
    | [
        {
          Codec: string;
          CodecTag: string;
          Language: string;
          ColorRange: string;
          ColorSpace: string;
          ColorTransfer: string;
          ColorPrimaries: string;
          DvVersionMajor: number;
          DvVersionMinor: number;
          DvProfile: number;
          DvLevel: number;
          RpuPresentFlag: number;
          ElPresentFlag: number;
          BlPresentFlag: number;
          DvBlSignalCompatibilityId: number;
          Rotation: number;
          Comment: string;
          TimeBase: string;
          CodecTimeBase: string;
          Title: string;
          Hdr10PlusPresentFlag: boolean;
          VideoRange: string;
          VideoRangeType: string;
          VideoDoViTitle: string;
          AudioSpatialFormat: string;
          LocalizedUndefined: string;
          LocalizedDefault: string;
          LocalizedForced: string;
          LocalizedExternal: string;
          LocalizedHearingImpaired: string;
          DisplayTitle: string;
          NalLengthSize: string;
          IsInterlaced: boolean;
          IsAVC: boolean;
          ChannelLayout: string;
          BitRate: number;
          BitDepth: number;
          RefFrames: number;
          PacketLength: number;
          Channels: number;
          SampleRate: number;
          IsDefault: boolean;
          IsForced: boolean;
          IsHearingImpaired: boolean;
          Height: number;
          Width: number;
          AverageFrameRate: number;
          RealFrameRate: number;
          ReferenceFrameRate: number;
          Profile: string;
          Type: string;
          AspectRatio: string;
          Index: number;
          Score: number;
          IsExternal: boolean;
          DeliveryMethod: string;
          DeliveryUrl: string;
          IsExternalUrl: boolean;
          IsTextSubtitleStream: boolean;
          SupportsExternalStream: boolean;
          Path: string;
          PixelFormat: string;
          Level: number;
          IsAnamorphic: boolean;
          [k: string]: unknown;
        },
      ];
  VideoType: string;
  PartCount: number;
  MediaSourceCount: number;
  ImageTags: {
    property1: string;
    property2: string;
    [k: string]: unknown;
  };
  BackdropImageTags: [] | [string];
  ScreenshotImageTags: [] | [string];
  ParentLogoImageTag: string;
  ParentArtItemId: string;
  ParentArtImageTag: string;
  SeriesThumbImageTag: string;
  ImageBlurHashes: {
    Primary: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    Art: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    Backdrop: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    Banner: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    Logo: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    Thumb: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    Disc: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    Box: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    Screenshot: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    Menu: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    Chapter: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    BoxRear: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    Profile: {
      property1: string;
      property2: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  SeriesStudio: string;
  ParentThumbItemId: string;
  ParentThumbImageTag: string;
  ParentPrimaryImageItemId: string;
  ParentPrimaryImageTag: string;
  Chapters:
    | []
    | [
        {
          StartPositionTicks: number;
          Name: string;
          ImagePath: string;
          ImageDateModified: string;
          ImageTag: string;
          [k: string]: unknown;
        },
      ];
  Trickplay: {
    property1: {
      property1: {
        Width: number;
        Height: number;
        TileWidth: number;
        TileHeight: number;
        ThumbnailCount: number;
        Interval: number;
        Bandwidth: number;
        [k: string]: unknown;
      };
      property2: {
        Width: number;
        Height: number;
        TileWidth: number;
        TileHeight: number;
        ThumbnailCount: number;
        Interval: number;
        Bandwidth: number;
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    property2: {
      property1: {
        Width: number;
        Height: number;
        TileWidth: number;
        TileHeight: number;
        ThumbnailCount: number;
        Interval: number;
        Bandwidth: number;
        [k: string]: unknown;
      };
      property2: {
        Width: number;
        Height: number;
        TileWidth: number;
        TileHeight: number;
        ThumbnailCount: number;
        Interval: number;
        Bandwidth: number;
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  LocationType: string;
  IsoType: string;
  MediaType: string;
  EndDate: string;
  LockedFields: [] | [string];
  TrailerCount: number;
  MovieCount: number;
  SeriesCount: number;
  ProgramCount: number;
  EpisodeCount: number;
  SongCount: number;
  AlbumCount: number;
  ArtistCount: number;
  MusicVideoCount: number;
  LockData: boolean;
  Width: number;
  Height: number;
  CameraMake: string;
  CameraModel: string;
  Software: string;
  ExposureTime: number;
  FocalLength: number;
  ImageOrientation: string;
  Aperture: number;
  ShutterSpeed: number;
  Latitude: number;
  Longitude: number;
  Altitude: number;
  IsoSpeedRating: number;
  SeriesTimerId: string;
  ProgramId: string;
  ChannelPrimaryImageTag: string;
  StartDate: string;
  CompletionPercentage: number;
  IsRepeat: boolean;
  EpisodeTitle: string;
  ChannelType: string;
  Audio: string;
  IsMovie: boolean;
  IsSports: boolean;
  IsSeries: boolean;
  IsLive: boolean;
  IsNews: boolean;
  IsKids: boolean;
  IsPremiere: boolean;
  TimerId: string;
  NormalizationGain: number;
  CurrentProgram: {
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export interface JellyfinItemsResponse {
  Items: JellyfinItem[];
  TotalRecordCount: number;
  StartIndex: number;
  [k: string]: unknown;
}
