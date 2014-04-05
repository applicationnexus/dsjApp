//
//  DBCopy.h
//  DBCopy Phonegap/Cordova Plugin
//
//  Created by Rahul Pandey on 12/19/13.
//
//

#import <Cordova/CDVPlugin.h>
#import <Foundation/Foundation.h>

@interface DBCopy : CDVPlugin
{
    NSString* callbackId;
    NSFileManager* fileManager;
    NSArray* paths;
    NSString* documentsDirectory;
}

@property (nonatomic, copy) NSString* callbackId;

- (void) copyDBtoDocDir:(CDVInvokedUrlCommand*)command;

@end

